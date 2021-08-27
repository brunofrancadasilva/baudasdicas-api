'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipe_ingredients', {
      quantity: {
        type: Sequelize.FLOAT
      },
      unit: {
        type: Sequelize.STRING
      },
      ingredientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ingredients',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      recipeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'recipes',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => queryInterface.addIndex('recipe_ingredients', ['recipeId', 'ingredientId'], { unique: true }) );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('recipe_ingredients');
  }
};
