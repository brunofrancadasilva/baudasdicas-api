'use strict';

const path = require('path');
const { nanoid } = require('nanoid');
const BaseRoute = require('./baseRoute');
const { asset: AssetModel } = require('./../models');
const StorageServiceClass = require('../services/storageService');
class Recipe extends BaseRoute {
  constructor () {
    super('Recipe', true);

    /* POST Routes */
    this.post('/form', this.handleUpload.bind(this));
  }

  async handleUpload (req) {
    const user = req.user;

    try {
      const uploadStreamHandler = async (params) => {
        const { fileStream, filename, mimetype } = params;
        const StorageService = new StorageServiceClass();
        const assetKey = `${user.id}/${new Date().getTime()}-${nanoid()}`;

        return StorageService.uploadFile(assetKey, fileStream)
          .then(async () => {
            const metadata = await StorageService.getMetadata(assetKey);
            
            const asset = new AssetModel({
              name: path.parse(filename).name,
              size: metadata.ContentLength,
              extension: path.extname(filename),
              contentType: mimetype,
              storageFileKey: assetKey,
              isArchived: false,
              userId: user.id
            });

            return asset.save();
          });
      }

      return this.getFilesAndUploadToStorage(req, uploadStreamHandler);
    } catch (e) {
      throw e;
    }
  }
}

module.exports = Recipe;
