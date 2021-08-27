'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    constructor (data) {
      super(data);
      
      this.id = data.id;
      this.name = data.name;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
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
      this.hasOne(models.recipe_ingredient, {
        as: 'recipe_ingredients'
      })
    }
  };

  
  Ingredient.init({
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'ingredient'
  });

  return Ingredient;
};
