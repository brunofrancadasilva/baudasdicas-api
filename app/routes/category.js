'use strict';

const BaseRoute = require('./baseRoute');
const { category: CategoryModel, recipe: RecipeModel, recipe_ingredient: RecipeIngredientModel, ingredient: IngredientModel } = require('./../models');

class Category extends BaseRoute {
  constructor () {
    super('Category', true);

    /* POST ROUTES */
    this.post('/', this.createCategory.bind(this));

    /* PUT ROUTES */
    this.put('/:id', this.updateCategory.bind(this));

    /* DELETE ROUTES */
    this.delete('/:id', this.deleteCategory.bind(this));

    /* GET ROUTES */
    this.get('/', this.getAll.bind(this));
  }

  async createCategory (req) {
    const { body: { name } } = req;

    if (!name) {
      throw new Error('A category name is required');
    }
    
    const category = new CategoryModel({
      name
    });

    return category.save();
  }

  async updateCategory (req) {
    const { body: { name }, params: { id: categoryId } } = req;

    if (!name) {
      throw new Error('A category name is required');
    }

    const category = await CategoryModel.findByPk(categoryId);

    if (!category) {
      throw new Error('No category was found');
    }

    return CategoryModel.update({
      name
    }, {
      where: {
        id: categoryId
      },
      returning: true
    }).then(response => response[1][0]);
  }

  async deleteCategory (req) {
    const { params: { id: categoryId } } = req;

    if (!categoryId) {
      throw new Error('A category id is required');
    }

    const category = await CategoryModel.findByPk(categoryId);

    if (!category) {
      throw new Error('No category was found');
    }

    return category.destroy();
  }

  async getAll () {
    const results = await CategoryModel.findAll({
      include: [
        {
          model: RecipeModel,
          as: 'recipes',
          where: {
            isArchived: false
          },
          include: [
            {
              model: IngredientModel,
              as: 'ingredients',
              through: {
                model: RecipeIngredientModel
              }
            }
          ]
        }
      ]
    });

    return results.map(result => {
      return {
        ...result.dataValues,
        recipes: result.recipes
      };
    });
  }
}

module.exports = Category;
