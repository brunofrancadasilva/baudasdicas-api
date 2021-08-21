'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    constructor (data) {
      super(data);
      
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
      this.isArchived = data.isArchived;
      this.additionalInfo = data.additionalInfo;
      this.authorId = data.authorId;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;

      this.author = data.author;
      this.steps = data.steps;
      this.ingredients = data.ingredients;
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
    getIsArchived () {
      return this.isArchived;
    }
    getAdditionalInfo () {
      return this.additionalInfo;
    }
    getAuthorId () {
      return this.authorId;
    }
    getCreatedAt () {
      return this.createdAt;
    }
    getUpdatedAt () {
      return this.updatedAt;
    }

    static associate (models) {
      this.belongsTo(models.user, {
        as: 'author',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'authorId',
          allowNull: false
        }
      });

      this.hasMany(models.ingredient, {
        as: 'ingredients'
      });

      this.hasMany(models.recipe_has_step, {
        as: 'steps'
      })
    }
  };

  Recipe.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    additionalInfo: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'recipe',
  });

  return Recipe;
};
