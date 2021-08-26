'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    constructor (data) {
      super(data);
      
      this.id = data.id;
      this.description = data.description;
      this.optional = data.optional;
      this.recipeId = data.recipeId;
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
    isOptional () {
      return this.optional;
    }
    getRecipeId () {
      return this.recipeId;
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
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'recipeId',
          allowNull: false
        }
      });
    }
  };

  Ingredient.init({
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    optional: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'ingredient'
  });

  return Ingredient;
};
