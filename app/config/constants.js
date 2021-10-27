'use strict';

const Sequelize = require('sequelize');
const CONSTANTS = {};

// server config
CONSTANTS.PORT = process.env.PORT || 3001;
CONSTANTS.NODE_ENV = process.env.NODE_ENV || 'development';
CONSTANTS.IS_PROD_ENV = CONSTANTS.NODE_ENV  === 'production';

// database config
CONSTANTS.DB_HOST = process.env.DB_HOST || 'localhost';
CONSTANTS.DB_PORT = process.env.DB_PORT || '5432';
CONSTANTS.DB_USER = process.env.DB_USER || 'postgres';
CONSTANTS.DB_PASSWORD = process.env.DB_PASSWORD || 'default';
CONSTANTS.DB_NAME = process.env.DB_NAME || 'recipes';
CONSTANTS.DB_CA_CERT = process.env.DB_CA_CERT || '';

if (CONSTANTS.IS_PROD_ENV && !CONSTANTS.DB_CA_CERT) {
  throw new Error('Missing DB Certificate');
}

CONSTANTS.DB_ISOLATION_LEVEL = Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ;

// auth config
CONSTANTS.JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '!R3c1p3sPr0j@';
CONSTANTS.JWT_EXPIRATION = '24h';

// storage config
CONSTANTS.STORAGE_KEY = 'OAJRZWHKORZAVVQUKE6U';
CONSTANTS.STORAGE_SECRET = 'SphEQNte7sL5cbbMcez32PhYXV1auEL54Ye4uU0kGzc';
CONSTANTS.STORAGE_ENDPOINT = 'nyc3.digitaloceanspaces.com';
CONSTANTS.BUCKET_NAME = 'prod-recipes-assets-baudicas-store';

if (!CONSTANTS.IS_PROD_ENV) {
  CONSTANTS.BUCKET_NAME = 'dev-recipes-assets-baudicas-store';
  CONSTANTS.STORAGE_KEY = 'AC2ZMYTCROGNRXIHHNNT';
  CONSTANTS.STORAGE_SECRET = '92v4XYO001gX2BdzT09t8i8Aewrf3yor36OJ5GBRus8';
} 

Object.freeze(CONSTANTS);

module.exports = CONSTANTS;
