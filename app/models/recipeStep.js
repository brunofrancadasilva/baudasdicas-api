'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecipeStep extends Model {
    constructor (data) {
      super(data);

      this.id = data.id;
      this.description = data.description;
      this.position = data.position;
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
    getPosition () {
      return this.position;
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

  RecipeStep.init({
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'recipe_step',
  });

  return RecipeStep;
};
