'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecipeNutrition extends Model {
    constructor (data) {
      super(data);
      
      this.id = data.id;
      this.description = data.description;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;

      this.recipe = data.recipe;
    }

    getId () {
      return this.id;
    }
    getDescription () {
      return this.description;
    }
    getCreatedAt () {
      return this.createdAt;
    }
    getUpdatedAt () {
      return this.updatedAt;
    }

    static associate(models) {
      this.belongsTo(models.recipe, {
        as: 'recipe',
        onDelete: 'cascade',
        foreignKey: {
          allowNull: false,
          name: 'recipeId'
        }
      });
    }
  };
  RecipeNutrition.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'recipe_nutrition',
  });
  return RecipeNutrition;
};
