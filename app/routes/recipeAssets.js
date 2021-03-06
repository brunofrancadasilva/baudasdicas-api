'use strict';

const BaseRoute = require('./baseRoute');
const AssetService = require('../services/business/assetService');

class RecipeAssets extends BaseRoute {
  constructor () {
    super('RecipeAsset', true);

    /* GET ROUTES */
    this.get('/:id', this.getById.bind(this));
    this.get('/:id/download', this.downloadById.bind(this));
  }

  async getById (req) {
    const { params: { id } } = req;
    const assetService = new AssetService();

    return assetService.getById(id);
  }

  async downloadById (req, res) {
    const { params: { id } } = req;
    const assetService = new AssetService();

    const assetUrl = await assetService.getDownloadUrl(id);

    if (!assetUrl) {
      res.status(404).end();
    } else {
      res.redirect(307, assetUrl);
    }
  }
}

module.exports = RecipeAssets;
