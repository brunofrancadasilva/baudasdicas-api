'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecipeTag extends Model {
    constructor (data) {
      super(data);
      
      this.id = data.id;
      this.name = data.name;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;

      this.recipe = data.recipe;
    }

    getId () {
      return this.id;
    }
    getName () {
      return this.name;
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
    }
  };
  
  RecipeTag.init({
    name: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'recipe_tag',
  });

  return RecipeTag;
};
