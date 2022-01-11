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
      this.standardName = data.standardName;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }

    getId () {
      return this.id;
    }
    getName () {
      return this.name;
    }
    getStandardName () {
      return this.standardName;
    }
    getCreatedAt () {
      return this.createdAt;
    }
    getUpdatedAt () {
      return this.updatedAt;
    }
  };

  
  Ingredient.init({
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    standardName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ingredient'
  });

  return Ingredient;
};
