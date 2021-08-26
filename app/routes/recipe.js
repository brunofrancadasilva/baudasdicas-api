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
      const recipe = new RecipeModel({
        name: name,
        description: description,
        additionalInfo: additionalInfo,
        isArchived: false,
        authorId: user.id
      });
      const savedRecipe = await recipe.save({ transaction });

      if (steps.length) {
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

        savedRecipe.steps = await StepModel.bulkCreate(mappedSteps, {
          transaction,
          returning: true
        });
      }

      if (ingredients.length) {
        const mappedIngredients = ingredients.map(ingredient => {
          if (!ingredient.description) {
            throw new Error('Invalid ingredient payload');
          }
  
          return new IngredientModel({
            description: ingredient.description,
            optional: Boolean(ingredient.optional),
            recipeId: savedRecipe.id,
          });
        })

        recipe.ingredients = await IngredientModel.bulkCreate(mappedIngredients, { 
          transaction,
          returning: true
        }); 
      }

      await transaction.commit();
      return {
        ...savedRecipe.dataValues,
        steps: savedRecipe.steps,
        ingredients: savedRecipe.ingredients,
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
      raw: true,
      nest: true
    });

    // WTF ??
    return {
      ...recipe,
      ingredients: recipe.ingredients && !Array.isArray(recipe.ingredients) && !recipe.ingredients.id ? [] : recipe.ingredients,
      steps: recipe.steps && !Array.isArray(recipe.steps) && !recipe.steps.id ? [] : recipe.steps,
      assets: recipe.assets && !Array.isArray(recipe.assets) && !recipe.assets.id ? [] : recipe.assets,
    };
  }
}

module.exports = Recipe;
