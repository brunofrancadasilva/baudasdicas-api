'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TemporaryFile extends Model {
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
      this.userId = data.userId;

      this.user = data.user;
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

    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: {
          allowNull: false,
          name: 'userId'
        },
        onDelete: 'CASCADE',
        as: 'user'
      });
    }
  };

  TemporaryFile.init({
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
    }
  }, {
    sequelize,
    modelName: 'temporary_file',
  });

  return TemporaryFile;
};
