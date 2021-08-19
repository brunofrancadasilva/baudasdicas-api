'use strict';

const CONSTANTS = require('./app/config/constants');

module.exports = {
  development: {
    DB_USER: CONSTANTS.DB_USER,
    DB_PASSWORD: CONSTANTS.DB_PASSWORD,
    DB_NAME: CONSTANTS.DB_NAME,
    DB_HOST: CONSTANTS.DB_HOST,
    DB_PORT: CONSTANTS.DB_PORT,
    dialect: 'postgres',
    schema: 'public',
    isolationLevel: CONSTANTS.DB_ISOLATION_LEVEL,
    pool: {
      max: 22,
      min: 0,
      idle: 10000,
      acquire: 30000
    },
  },
  production: {
    DB_USER: CONSTANTS.DB_USER,
    DB_PASSWORD: CONSTANTS.DB_PASSWORD,
    DB_NAME: CONSTANTS.DB_NAME,
    DB_HOST: CONSTANTS.DB_HOST,
    DB_PORT: CONSTANTS.DB_PORT,
    dialect: 'postgres',
    schema: 'public',
    isolationLevel: CONSTANTS.DB_ISOLATION_LEVEL,
    pool: {
      max: 22,
      min: 0,
      idle: 10000,
      acquire: 30000
    },
  }
}