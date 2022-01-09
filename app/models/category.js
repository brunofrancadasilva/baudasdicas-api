'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    constructor (data) {
      super(data);

      this.id = data.id;
      this.name = data.name;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;

      if (Array.isArray(data.recipes)) {
        this.recipes = data.recipes.reduce((arr, recipe) => {
          if (recipe && recipe.id) {
            arr.push(recipe);
          }

          return arr;
        }, []);
      } else {
        this.recipe = data.recipes;
      }
    }
    static associate(models) {
      this.hasMany(models.recipe, {
        as: 'recipes'
      });
    }
  };
  
  Category.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'category',
  });

  return Category;
};
