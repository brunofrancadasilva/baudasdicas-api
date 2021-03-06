'use strict';

const BaseRoute = require('./baseRoute');
const RecipeService = require('../services/business/recipeService');
const { sequelize, recipe_asset: AssetModel, recipe: RecipeModel, recipe_ingredient: RecipeIngredient } = require('../models');
const IngredientService = require('../services/business/ingredientService');

class Recipe extends BaseRoute {
  constructor () {
    super('Recipe', true);

    /* POST Routes */
    this.post('/', this.createRecipe.bind(this));
    this.post('/:id/assets', this.attachAssets.bind(this));

    /* PUT Routes */
    this.put('/:id/cover', this.setRecipeCover.bind(this));

    /* GET Routes */
    this.get('/', this.getAllRecipes.bind(this));
    this.get('/:id', this.getRecipeById.bind(this));
  }

  async createRecipe (req) {
    const { body: { name, description, servingTime, categoryId, tags = [], steps = [], ingredients = [] } } = req;
    const user = req.user;
    const transaction = await sequelize.transaction();
    
    // services
    const recipeService = new RecipeService();
    const ingredientService = new IngredientService();

    try {
      // validation
      if (!steps.length || !ingredients.length) {
        throw new Error('You must provide at least one step and one ingredient');
      }

      if (!categoryId) {
        throw new Error('You must provide a category');
      }

      // create recipe
      const savedRecipe = await recipeService.createRecipe({
        name,
        description,
        servingTime,
        categoryId
      }, user, transaction);

      // create steps
      await recipeService.handleRecipeSteps(steps, [], savedRecipe.id, transaction);

      // create ingredients
      const dbIngredients = await ingredientService.handleDbIngredients(ingredients, transaction);
      const mappedNewIngredients = dbIngredients.map(ingredient => {
        return new RecipeIngredient({
          recipeId: savedRecipe.id,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          ingredientId: ingredient.id,
        });
      });
      await recipeService.handleRecipeIngredients(mappedNewIngredients, [], savedRecipe.id, transaction);
      
      // create tags
      const newTags = tags.filter(tag => tag.name);
      await recipeService.handleRecipeTags(newTags, [], savedRecipe.id, transaction);

      await transaction.commit();
      return recipeService.getById(savedRecipe.id);
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async attachAssets (req) {
    const { body: { assets = [] }, params: { id }, user } = req;
    const recipeService = new RecipeService();
    const transaction = await sequelize.transaction();

    try {
      if (!assets.length) {
        return;
      }

      const recipe = await RecipeModel.findOne({
        where: {
          id,
          authorId: user.id
        }
      });

      if (!recipe) {
        throw new Error('Recipe not found');
      }

      const savedAssets = await recipeService.attachAssets(assets, recipe, user, transaction);
      await transaction.commit();

      return savedAssets;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async setRecipeCover (req) {
    const { params: { id: recipeId }, body: { assetId } } = req;
    const transaction = await sequelize.transaction();

    try {
      if (!assetId) {
        throw new Error('An assetId is required');
      }
  
      const newCoverAsset = await AssetModel.findOne({
        where: {
          recipeId,
          id: assetId
        }
      });
  
      if (!newCoverAsset) {
        throw new Error('Asset not found');
      }

      await AssetModel.update({
        isCover: false,
        isArchived: false
      }, {
        where: {
          recipeId
        },
        transaction
      });

      await AssetModel.update({
        isCover: true,
        isArchived: false
      }, {
        where: {
          recipeId,
          id: assetId
        },
        transaction
      });

      return transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async getRecipeById (req) {
    const { params: { id: recipeId } } = req;
    const recipeService = new RecipeService();

    return recipeService.getById(recipeId);
  }

  async getAllRecipes () {
    const recipeService = new RecipeService();

    return recipeService.getAll();
  }
}

module.exports = Recipe;
