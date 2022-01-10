'use strict';

const { ingredient: IngredientModel } = require('./../../models');
class IngredientService {
  constructor () {}

  standardizeUtf8IngredientName (ingredientName) {
    if (!ingredientName) {
      throw new Error('Ingredient name is required');
    }
    
    return ingredientName.replace(/ /g, '-').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // { id: null || 1, name: 'Chocolate', quantity: '1', unit: 'cup' }
  async handleDbIngredients (ingredients = [], transaction) {
    const newIngredients = ingredients.filter(ing => !ing.id).map(ing => {
      return new IngredientModel({
        name: ing.name
      });
    });

    const createdIngredients = await IngredientModel.bulkCreate(newIngredients, { transaction, returning: true });
    
    return [
      ...ingredients.filter(ing => ing.id),
      ...createdIngredients.map(ing => {
        return {
          id: ing.id,
          name: ing.name,
          quantity: ingredients.find(i => i.name === ing.name).quantity,
          unit: ingredients.find(i => i.name === ing.name).unit
        };
      })
    ];
  }

  getAll () {
    return IngredientModel.findAll();
  }
}

module.exports = IngredientService;
