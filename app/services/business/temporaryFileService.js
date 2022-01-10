'use strict';

const path = require('path');
const { nanoid } = require('nanoid');
const { temporary_file: TemporaryFileModel } = require('../../models');
const StorageServiceClass = require('../utilities/storageService');

class AssetService {
  constructor () {}

  async handleUpload (file, user) {
    const { fileStream, filename, mimetype } = file;
    const StorageService = new StorageServiceClass();
    const assetKey = `${user.id}/TEMP/${new Date().getTime()}-${nanoid()}`;

    return StorageService.uploadFile(assetKey, fileStream)
      .then(async () => {
        const metadata = await StorageService.getMetadata(assetKey);
        
        const asset = new TemporaryFileModel({
          name: path.parse(filename).name,
          size: metadata.ContentLength,
          extension: path.extname(filename),
          contentType: mimetype,
          storageFileKey: assetKey,
          userId: user.id
        });

        return asset.save();
      });
  }

  async getByUuid (assetUuid) {
    if (!assetUuid) {
      throw new Error('Asset Id is required');
    }
    
    return TemporaryFileModel.findOne({
      where: {
        storageFileKey: assetUuid
      }
    });
  }

  async getDownloadUrl (assetUuid) {
    if (!assetUuid) {
      throw new Error('Asset Id is required');
    }
    const storageService = new StorageServiceClass();
    const asset = await this.getByUuid(assetUuid);

    if (!asset) {
      throw new Error('File not found');
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
