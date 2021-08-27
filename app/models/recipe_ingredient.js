'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe_ingredient extends Model {
    constructor (data) {
      super(data);
      
      this.id = data.id;
      this.quantity = data.quantity;
      this.unit = data.unit;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;

      this.recipe = data.recipe;
      this.ingredient = data.ingredient;
    }

    getId () {
      return this.id;
    }
    getQuantity () {
      return this.quantity;
    }
    getUnit () {
      return this.unit;
    }
    getCreatedAt () {
      return this.createdAt;
    }
    getUpdatedAt () {
      return this.updatedAt;
    }
    static associate(models) {
      // define association here
      this.belongsTo(models.recipe, {
        as: 'recipe',
        onDelete: 'CASCADE',
        foreignKey: {
          allowNull: false,
          name: 'recipeId'
        }
      });

      this.belongsTo(models.ingredient, {
        as: 'ingredient',
        onDelete: 'CASCADE',
        foreignKey: {
          allowNull: false,
          name: 'ingredientId'
        }
      });
    }
  };
  
  Recipe_ingredient.init({
    quantity: {
      type: DataTypes.FLOAT,
    },
    unit: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'recipe_ingredient',
  });

  return Recipe_ingredient;
};
