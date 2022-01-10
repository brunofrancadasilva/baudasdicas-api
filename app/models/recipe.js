'use strict';
const { Model } = require('sequelize');
const ModelUtilsClass = require('../services/utilities/modelUtils');
const ModelUtils = new ModelUtilsClass();

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
      this.steps = ModelUtils.standardizeArrayData(data.steps);
      this.assets = ModelUtils.standardizeArrayData(data.assets);
      this.category = ModelUtils.standardizeArrayData(data.category);
      this.ingredients = ModelUtils.standardizeArrayData(data.ingredients);
      this.tags = ModelUtils.standardizeArrayData(data.tags);
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

      this.belongsTo(models.category, {
        as: 'category',
        onDelete: 'CASCADE',
        foreignKey: {
          name: 'categoryId',
          allowNull: false
        }
      });

      this.hasMany(models.recipe_step, {
        as: 'steps'
      });

      this.hasMany(models.recipe_asset, {
        as: 'assets'
      });

      this.hasMany(models.recipe_tag, {
        as: 'tags'
      });

      this.hasMany(models.recipe_nutrition, {
        as: 'nutrition_facts'
      });
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
    servingTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'recipe',
  });

  return Recipe;
};
