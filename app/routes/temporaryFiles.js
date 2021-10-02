'use strict';

const BaseRoute = require('./baseRoute');
const TemporaryFileService = require('../services/business/temporaryFileService');
const StorageServiceClass = require('../services/utilities/storageService');

class RecipeAssets extends BaseRoute {
  constructor () {
    super('TemporaryFile', true);

    /* POST ROUTES */
    this.post('/', this.upload.bind(this));

    /* GET ROUTES */
    this.get('/:uuid', this.getByUuid.bind(this));
    this.get('/:uuid/download', this.downloadByUuid.bind(this));
  }

  async upload (req) {
    const { user } = req;
    const temporaryFileService = new TemporaryFileService();
    
    return this.getFilesAndUploadToStorage(req, temporaryFileService.handleUpload, [user]);
  }

  async getByUuid (req) {
    const { params: { uuid } } = req;
    const temporaryFileService = new TemporaryFileService();

    return temporaryFileService.getByUuid(id);
  }

  async downloadByUuid (req, res) {
    const { params: { uuid } } = req;
    const temporaryFileService = new TemporaryFileService();

    const assetUrl = await temporaryFileService.getDownloadUrl(uuid);

    if (!assetUrl) {
      res.status(404).end();
    } else {
      res.redirect(307, assetUrl);
    }
  }
}

module.exports = RecipeAssets;
