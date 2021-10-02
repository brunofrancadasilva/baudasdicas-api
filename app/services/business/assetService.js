'use strict';

const { recipe_asset: AssetModel } = require('../../models');
const StorageService = require('../utilities/storageService');

class AssetService {
  constructor () {}

  async getById (assetId) {
    if (!assetId) {
      throw new Error('Asset Id is required');
    }
    
    return AssetModel.findByPk(assetId);    
  }

  async getDownloadUrl (assetId) {
    if (!assetId) {
      throw new Error('Asset Id is required');
    }
    const storageService = new StorageService();
    const asset = await this.getById(assetId);

    if (!asset) {
      throw new Error('Asset not found');
    }
    const assetUrl = await storageService.getPresignedUrl({
      key: asset.storageFileKey,
      filename: asset.name,
      extension: asset.extension,
      contentType: asset.contentType
    });

    return assetUrl;
  }
}

module.exports = AssetService;
