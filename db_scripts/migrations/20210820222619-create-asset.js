'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipe_assets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      size: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      contentType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      extension: {
        type: Sequelize.STRING,
        allowNull: false
      },
      storageFileKey: {
        type: Sequelize.STRING,
        allowNull: false
      },
      thumbnailFileKey: {
        type: Sequelize.STRING,
        allowNull: true
      },
      thumbnailContentType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      thumbnailSize: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      thumbnailExtension: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isArchived: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isCover: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('recipe_assets');
  }
};
