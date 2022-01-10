'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE "public"."ingredients" ADD COLUMN "standardName" TEXT UNIQUE;');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE "public"."ingredients" DROP COLUMN "standardName";');
  }
};
