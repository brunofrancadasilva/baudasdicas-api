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
      this.description = data.description;
      this.quantity = data.quantity;
      this.unit = data.unit;
      this.optional = data.optional;
      this.recipeId = data.recipeId;
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
    getDescription () {
      return this.description;
    }
    getQuantity () {
      return this.quantity;
    }
    getUnit () {
      return this.unit;
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    optional: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'ingredient',
  });

  return Ingredient;
};
