'use strict';

const { sequelize, ingredient: IngredientModel } = require('./../../models');
class IngredientService {
  constructor () {}

  standardizeUtf8IngredientName (ingredientName) {
    if (!ingredientName) {
      throw new Error('Ingredient name is required');
    }
    
    return ingredientName.replace(/ /g, '-').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  checkIfIngredientExists (ingredientStandardName) {
    return IngredientModel.findOne({
      where: {
        standardName: ingredientStandardName
      }
    });
  }

  // { id: null || 1, name: 'Chocolate', quantity: '1', unit: 'cup' }
  async handleDbIngredients (ingredients = [], transaction) {
    const mappedIngredients = ingredients.map(ing => {
      return {
        ...ing,
        standardName: this.standardizeUtf8IngredientName(ing.name)
      };
    });

    const existingIngredients = mappedIngredients.filter(ing => ing.id);
    const nonExistingIngredients = mappedIngredients.filter(ing => !ing.id);
    
    const ingredientsToCreatePromises = nonExistingIngredients.map(async ing => {
      const dbIngredient = await this.checkIfIngredientExists(ing.standardName);

      if (dbIngredient) {
        existingIngredients.push({
          ...ing,
          id: dbIngredient.id
        });

        return null;
      }

      return ing;
    });
    const ingredientsToCreate = (await Promise.all(ingredientsToCreatePromises)).filter(Boolean);
    const createdIngredients = await IngredientModel.bulkCreate(ingredientsToCreate, { transaction, returning: true });

    return [
      ...existingIngredients,
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
