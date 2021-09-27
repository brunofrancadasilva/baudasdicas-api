'use strict';

const BaseRoute = require('./baseRoute');
const { user: UserModel, recipe: RecipeModel, ingredient: IngredientModel, step: StepModel, asset: AssetModel } = require('../models');

class User extends BaseRoute {
  constructor () {
    super('User', true);

    /* GET Routes */
    this.get('/loggedIn', this.getLoggedUser.bind(this));
    this.get('/recipes', this.getLoggedUserRecipes.bind(this));
    this.get('/:id/recipes', this.getUserRecipes.bind(this));
  }

  async getLoggedUser (req) {
    const { user } = req;

    return user;
  }

  async getLoggedUserRecipes (req) {
    const user = req.user;

    const recipes = await user.getRecipes({
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
        }
      ]
    });

    return recipes.map(recipe => {
      return {
        ...recipe.dataValues,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        assets: recipe.assets && Array.isArray(recipe.assets) && !recipe.assets[0].id ? [] : recipe.assets,
        author: user
      }
    });
  }

  async getUserRecipes (req) {
    const { params: { id: userId } } = req;

    const user = await UserModel.scope('withoutPassword').findByPk(userId, {
      include: [
        {
          model: RecipeModel,
          as: 'recipes',
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
            }
          ]
        }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.recipes.map(recipe => {
      return {
        ...recipe,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        assets: recipe.assets && Array.isArray(recipe.assets) && !recipe.assets[0].id ? [] : recipe.assets,
        author: user.dataValues
      }
    });
  }
}

module.exports = User;
