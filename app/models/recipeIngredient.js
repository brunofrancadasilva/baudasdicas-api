'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe_ingredient extends Model {
    constructor (data) {
      super(data);
      
      this.quantity = data.quantity;
      this.unit = data.unit;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;

      this.recipe = data.recipe;
      this.ingredient = data.ingredient;
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

      models.recipe.belongsToMany(models.ingredient, {
        as: 'ingredients',
        through: this,
        onDelete: 'cascade',
        foreignKey: {
          name: 'recipeId'
        }
      });

      models.ingredient.belongsToMany(models.recipe, {
        as: 'recipes',
        through: this,
        onDelete: 'cascade',
        foreignKey: {
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
    indexes: [
      {
        unique: true,
        fields: ['recipeId', 'ingredientId']
      }
    ]
  });

  return Recipe_ingredient;
};
