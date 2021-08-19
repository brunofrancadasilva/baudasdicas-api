'use strict';
const CONSTANTS = require('./constants');
console.log('db.js', CONSTANTS);
const db = {
  DB_HOST: CONSTANTS.DB_HOST,
  DB_USER: CONSTANTS.DB_USER,
  DB_PASSWORD: CONSTANTS.DB_PASSWORD,
  DB_PORT: CONSTANTS.DB_PORT,
  DB_NAME: CONSTANTS.DB_NAME,
  dialect: 'postgres',
  schema: 'public',
  isolationLevel: CONSTANTS.DB_ISOLATION_LEVEL,
  pool: {
    max: 25,
    min: 0,
    idle: 10000,
    acquire: 30000
  },
};

module.exports = db;