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

      this.recipes = data.recipes;
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
