'use strict';

const Sequelize = require('sequelize');
const CONSTANTS = {};

// server config
CONSTANTS.PORT = process.env.PORT || 8080;
CONSTANTS.NODE_ENV = process.env.NODE_ENV || 'development';
CONSTANTS.IS_PROD_ENV = CONSTANTS.NODE_ENV  === 'production';

// database config
CONSTANTS.DB_HOST = process.env.DB_HOST || 'localhost';
CONSTANTS.DB_PORT = process.env.DB_PORT || '5432';
CONSTANTS.DB_USER = process.env.DB_USER || 'postgres';
CONSTANTS.DB_PASSWORD = process.env.DB_PASSWORD || 'default';
CONSTANTS.DB_NAME = process.env.DB_NAME || 'recipes';
CONSTANTS.DB_ISOLATION_LEVEL = Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ;

// auth config
CONSTANTS.JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '!R3c1p3sPr0j@';
CONSTANTS.JWT_EXPIRATION = '24h';

// storage config
CONSTANTS.STORAGE_KEY = '3W3RJBHO6ABYBGM3MG6V';
CONSTANTS.STORAGE_SECRET = 'X/16VIcV3La5PuafPwO+7BfAv5bBHKzEuTV6vb4YvO4';
CONSTANTS.STORAGE_ENDPOINT = 'nyc3.digitaloceanspaces.com';
CONSTANTS.BUCKET_NAME = 'prod-recipes-assets-store';

if (!CONSTANTS.IS_PROD_ENV) {
  CONSTANTS.BUCKET_NAME = 'dev-recipes-assets-store';
  CONSTANTS.STORAGE_KEY = 'HFRIU77WDWGF53II6T6E';
  CONSTANTS.STORAGE_SECRET = 'P/uyh12K7KlB+oXfzjWFyPjPhqvFuGC5BSOP/M64k3w';
} 

Object.freeze(CONSTANTS);

module.exports = CONSTANTS;
