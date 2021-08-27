'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe_asset extends Model {
    constructor (data) {
      super(data);

      this.name = data.name;
      this.size = data.size;
      this.contentType = data.contentType;
      this.extension = data.extension;
      this.storageFileKey = data.storageFileKey;
      this.thumbnailFileKey = data.thumbnailFileKey;
      this.thumbnailContentType = data.thumbnailContentType;
      this.thumbnailSize = data.thumbnailSize;
      this.thumbnailExtension = data.thumbnailExtension;
      this.isArchived = data.isArchived;
      this.isCover = data.isCover;
      this.recipeId = data.recipeId;

      this.recipe = data.recipe;
    }

    getName () {
      return this.name;
    }
    getSize () {
      return this.size;
    }
    getContentType () {
      return this.contentType;
    }
    getExtension () {
      return this.extension;
    }
    getStorageFileKey () {
      return this.storageFileKey;
    }
    getThumbnailFileKey () {
      return this.thumbnailFileKey;
    }
    getThumbnailContentType () {
      return this.thumbnailContentType;
    }
    getThumbnailSize () {
      return this.thumbnailSize;
    }
    getThumbnailExtension () {
      return this.thumbnailExtension;
    }
    getIsArchived () {
      return this.isArchived;
    }
    getIsCover () {
      return this.isCover;
    }
    getRecipeId () {
      return this.recipeId;
    }

    static associate(models) {
      this.belongsTo(models.recipe, {
        foreignKey: {
          allowNull: false,
          name: 'recipeId'
        },
        onDelete: 'CASCADE',
        as: 'recipe'
      });
    }
  };

  Recipe_asset.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: false
    },
    storageFileKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnailFileKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thumbnailContentType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thumbnailSize: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    thumbnailExtension: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isCover: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'recipe_asset',
  });

  return Recipe_asset;
};
