'use strict';

const path = require('path');
const { nanoid } = require('nanoid');
const BaseRoute = require('./baseRoute');
const { sequelize, user: UserModel, asset: AssetModel, recipe: RecipeModel, ingredient: IngredientModel, step: StepModel } = require('./../models');
const StorageServiceClass = require('./../services/utilities/storageService');

class Recipe extends BaseRoute {
  constructor () {
    super('Recipe', true);

    /* POST Routes */
    this.post('/', this.createRecipe.bind(this));
    this.post('/:id/assets', this.attachAssets.bind(this));

    /* GET Routes */
    this.get('/:id', this.getRecipeById.bind(this));
  }

  async createRecipe (req) {
    const { body: { name, description, additionalInfo, steps = [], ingredients = [] } } = req;
    const user = req.user;
    const transaction = await sequelize.transaction();

    try {
      if (!steps.length || !ingredients.length) {
        throw new Error('You must provide at least one step and one ingredient');
      }

      // create recipe
      const recipe = new RecipeModel({
        name: name,
        description: description,
        additionalInfo: additionalInfo,
        isArchived: false,
        authorId: user.id
      });
      const savedRecipe = await recipe.save({ transaction });

      // create steps
      const mappedSteps = steps.map(step => {
        if (!step.description || step.position === null || step.position === undefined) {
          throw new Error('Invalid step properties');
        }

        return new StepModel({
          description: step.description,
          position: step.position,
          recipeId: savedRecipe.id,
        });
      })
      const savedSteps = await StepModel.bulkCreate(mappedSteps, {
        transaction,
        returning: true
      });

      // create ingredients
      const mappedIngredients = ingredients.map(ingredient => {
        if (!ingredient.description) {
          throw new Error('Invalid ingredient payload');
        }

        return new IngredientModel({
          description: ingredient.description,
          optional: Boolean(ingredient.optional),
          recipeId: savedRecipe.id,
        });
      });
      const savedIngredients = await IngredientModel.bulkCreate(mappedIngredients, { 
        transaction,
        returning: true
      }); 

      await transaction.commit();
      return {
        ...savedRecipe.dataValues,
        steps: savedSteps,
        ingredients: savedIngredients,
        author: await savedRecipe.getAuthor({ scope: 'withoutPassword' })
      };
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async attachAssets (req) {
    const { params: { id: recipeId } } = req;

    try {
      const uploadStreamHandler = async (file, recipe) => {
        const { fileStream, filename, mimetype } = file;
        const StorageService = new StorageServiceClass();
        const assetKey = `${user.id}/${new Date().getTime()}-${nanoid()}`;

        return StorageService.uploadFile(assetKey, fileStream)
          .then(async () => {
            const metadata = await StorageService.getMetadata(assetKey);
            
            const asset = new AssetModel({
              name: path.parse(filename).name,
              size: metadata.ContentLength,
              extension: path.extname(filename),
              contentType: mimetype,
              storageFileKey: assetKey,
              isArchived: false,
              recipeId: recipe.id
            });

            return asset.save();
          });
      };

      const recipe = await RecipeModel.findByPk(recipeId);

      if (!recipe) {
        throw new Error('Recipe not found');
      }

      const uploadedAssets = await this.getFilesAndUploadToStorage(req, uploadStreamHandler, [recipe]);

      return {
        recipe,
        assets: uploadedAssets
      };
    } catch (e) {
      throw e;
    }
  }

  async getRecipeById (req) {
    const { params: { id: recipeId } } = req;

    const recipe = await RecipeModel.findByPk(recipeId, {
      include: [
        {
          model: IngredientModel,
          as: 'ingredients',
          required: false
        },
        {
          model: StepModel,
          as: 'steps',
          required: false
        },
        {
          model: AssetModel,
          as: 'assets',
          required: false
        },
        {
          model: UserModel.scope('withoutPassword'),
          as: 'author',
          required: true,
        }
      ],
      order: [[ { model: StepModel, as: 'steps'}, 'position', 'ASC' ]],
    });

    return {
      ...recipe.dataValues,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      assets: recipe.assets && Array.isArray(recipe.assets) && !recipe.assets[0].id ? [] : recipe.assets,
      author: await recipe.getAuthor({ scope: 'withoutPassword' })
    };
  }
}

module.exports = Recipe;
