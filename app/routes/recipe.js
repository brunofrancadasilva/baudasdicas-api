'use strict';

const path = require('path');
const { nanoid } = require('nanoid');
const BaseRoute = require('./baseRoute');
const { asset: AssetModel, recipe: RecipeModel } = require('./../models');
const StorageServiceClass = require('./../services/utilities/storageService');

class Recipe extends BaseRoute {
  constructor () {
    super('Recipe', true);

    /* POST Routes */
    this.post('/form', this.createRecipe.bind(this));
  }

  async createRecipe (req) {
    const { body: { name, description, additionalInfo, steps = [], ingredients = [] } } = req;
    const user = req.user;

    try {
      // deal uploaded files
      const uploadStreamHandler = async (file, recipe) => {
        const { fileStream, filename, mimetype } = file;
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
              recipeId: recipe.id
            });

            return asset.save();
          });
      };

      // create recipe
      const recipe = new RecipeModel({
        name: 'teste',
        description: '',
        additionalInfo: '',
        isArchived: false,
        authorId: user.id
      });

      const savedRecipe = await recipe.save();
      const uploadedAssets = await this.getFilesAndUploadToStorage(req, uploadStreamHandler, [savedRecipe]);

      return {
        ...savedRecipe.dataValues,
        author: await savedRecipe.getAuthor(),
        assets: uploadedAssets
      };
    } catch (e) {
      throw e;
    }
  }
}

module.exports = Recipe;
