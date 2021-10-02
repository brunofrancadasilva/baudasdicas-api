'use strict';

const { Sequelize: { Op }, user: UserModel, recipe: RecipeModel, recipe_tag: RecipeTagModel, recipe_asset: AssetModel, recipe_step: StepModel, recipe_ingredient: RecipeIngredientModel, ingredient: IngredientModel, temporary_file: TemporaryFileModel } = require('./../../models');
const Utils = require('./../utilities/utils');
const StorageService = require('../utilities/storageService');

class RecipeService {
  constructor () {}

  createRecipe (recipeData, user, transaction) {
    const { name, description, servingTime, categoryId } = recipeData;

    const recipe = new RecipeModel({
      name,
      description,
      servingTime,
      categoryId,
      isArchived: false,
      authorId: user.id
    });

    return recipe.save({ transaction });
  }

  async handleRecipeSteps (newSteps, existentSteps, recipeId, transaction) {
    const utils = new Utils();
    const diff = utils.diffArray(newSteps, existentSteps, (a, b) => a.id !== b.id || a.description !== b.description);
    const promises = [];

    if (diff.added.length) {
      const addedSteps = diff.added.map(step => {
        return {
          recipeId,
          description: step.description,
          position: step.position
        };
      });

      promises.push(StepModel.bulkCreate(addedSteps, { transaction }));
    }

    if (diff.removed.length) {
      const removedSteps = diff.removed.map(step => StepModel.destroy({ 
        where: { 
          recipeId,
          id: step.id,   
        } 
      }, { transaction }));
      
      promises.push(...removedSteps);
    }

    return Promise.all(promises);
  }

  async handleRecipeIngredients (newIngredients, existentIngredients, recipeId, transaction) {
    const utils = new Utils();
    const diff = utils.diffArray(newIngredients, existentIngredients, (a, b) => a.ingredientId !== b.ingredientId || a.quantity !== b.quantity || a.unit !== b.unit);
    const promises = [];

    if (diff.added.length) {
      const addedIngredients = diff.added.map(ingredient => {
        return {
          recipeId,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          ingredientId: ingredient.ingredientId,
        };
      });

      promises.push(RecipeIngredientModel.bulkCreate(addedIngredients, { transaction }));
    }

    if (diff.removed.length) {
      const removedIngredients = diff.removed.map(ingredient => RecipeIngredientModel.destroy({ 
        where: { 
          recipeId,
          id: ingredient.ingredientId,   
        } 
      }, { transaction }));
      
      promises.push(...removedIngredients);
    }

    return Promise.all(promises);
  }

  async handleRecipeTags (newTags, existentTags, recipeId, transaction) {
    const utils = new Utils();
    const diff = utils.diffArray(newTags, existentTags, (a, b) => a.id !== b.id);
    const promises = [];

    if (diff.added.length) {
      const addedTags = diff.added.map(tag => {
        return {
          recipeId,
          name: tag.name
        };
      });

      promises.push(RecipeTagModel.bulkCreate(addedTags, { transaction }));
    }

    if (diff.removed.length) {
      const removedTags = diff.removed.map(tag => RecipeTagModel.destroy({ 
        where: { 
          recipeId,
          id: tag.id,   
        } 
      }, { transaction }));
      
      promises.push(...removedTags);
    }

    return Promise.all(promises);
  }

  async getById (id) {
    const recipe = await RecipeModel.findByPk(id, {
      include: [
        {
          model: IngredientModel,
          as: 'ingredients',
          required: false,
          through: {
            model: RecipeIngredientModel
          }
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
          model: RecipeTagModel,
          as: 'tags',
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

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    return {
      ...recipe.dataValues,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      tags: recipe.tags && Array.isArray(recipe.tags) && !recipe.tags[0].id ? [] : recipe.tags,
      assets: recipe.assets && Array.isArray(recipe.assets) && !recipe.assets[0].id ? [] : recipe.assets,
      author: await recipe.getAuthor({ scope: 'withoutPassword' })
    };
  }

  async getAll () {
    const recipes = await RecipeModel.findAll({
      where: {
        isArchived: false
      },
      include: [
        {
          model: IngredientModel,
          as: 'ingredients',
          required: false,
          through: {
            model: RecipeIngredientModel
          }
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
          model: RecipeTagModel,
          as: 'tags',
          required: false
        },
        {
          model: UserModel.scope('withoutPassword'),
          as: 'author',
          required: true,
        }
      ],
      order: [['id', 'DESC'], [ { model: StepModel, as: 'steps'}, 'position', 'ASC' ]],
    });

    return Promise.all(recipes.map(async recipe => {
      return {
        ...recipe.dataValues,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        tags: recipe.tags && Array.isArray(recipe.tags) && !recipe.tags[0].id ? [] : recipe.tags,
        assets: recipe.assets && Array.isArray(recipe.assets) && !recipe.assets[0].id ? [] : recipe.assets,
        author: await recipe.getAuthor({ scope: 'withoutPassword' })
      };
    }));
  }

  async attachAssets (assets, recipe, user, transaction) {
    const storageService = new StorageService();
    const tempFiles = await TemporaryFileModel.findAll({
      where: {
        storageFileKey: {
          [Op.in]: assets
        },
        userId: user.id
      }
    });

    const promises = tempFiles.map(async tempFile => {
      const newS3Key = tempFile.storageFileKey.replace('/TEMP', '');
      const copy = await storageService.copy({
        destination: newS3Key,
        source: tempFile.storageFileKey
      });

      const newRecipeAsset = new AssetModel({
        name: tempFile.name,
        size: tempFile.size,
        contentType: tempFile.contentType,
        extension: tempFile.extension,
        thumbnailFileKey: tempFile.thumbnailFileKey,
        thumbnailContentType: tempFile.thumbnailContentType,
        thumbnailSize: tempFile.thumbnailSize,
        thumbnailExtension: tempFile.thumbnailExtension,
        storageFileKey: newS3Key,
        isCover: false,
        isArchived: false,
        recipeId: recipe.id
      });

      const savedAsset = await newRecipeAsset.save({ transaction });
      await tempFile.destroy({ transaction });

      return savedAsset;
    });

    return Promise.all(promises);
  }
}

module.exports = RecipeService;
