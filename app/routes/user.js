'use strict';

const BaseRoute = require('./baseRoute');
const { user: UserModel, recipe: RecipeModel } = require('./../models');

class User extends BaseRoute {
  constructor () {
    super('User', true);

    /* GET Routes */
    this.get('/recipes', this.getLoggedUserRecipes.bind(this));
    this.get('/:id/recipes', this.getUserRecipes.bind(this));
  }

  async getLoggedUserRecipes (req) {
    const user = req.user;

    return user.getRecipes();
  }

  async getUserRecipes (req) {
    const { params: { id: userId } } = req;

    const user = await UserModel.findByPk(userId, {
      include: [
        {
          model: RecipeModel,
          as: 'recipes'
        }
      ]
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.recipes;
  }
}

module.exports = User;
