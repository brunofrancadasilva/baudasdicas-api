'use strict';

const CONSTANTS = require('./app/config/constants');

module.exports = {
  development: {
    username: CONSTANTS.DB_USER,
    password: CONSTANTS.DB_PASSWORD,
    database: CONSTANTS.DB_NAME,
    host: CONSTANTS.DB_HOST,
    port: CONSTANTS.DB_PORT,
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
    username: CONSTANTS.DB_USER,
    password: CONSTANTS.DB_PASSWORD,
    database: CONSTANTS.DB_NAME,
    host: CONSTANTS.DB_HOST,
    port: CONSTANTS.DB_PORT,
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