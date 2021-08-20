'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE public.recipes ADD COLUMN "additionalInfo" TEXT NULL');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE public.recipes DROP COLUMN "additionalInfo"');
  }
};
