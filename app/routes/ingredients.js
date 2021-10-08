'use strict';

const BaseRoute = require('./baseRoute');
const IngredientService = require('../services/business/ingredientService');

class Ingredient extends BaseRoute {
  constructor () {
    super('Ingredient', true);

    /* GET ROUTES */
    this.get('/', this.getAll.bind(this));
  }

  async getAll (req) {
    const ingredientService = new IngredientService();

    return ingredientService.getAll();
  }
}

module.exports = Ingredient;
