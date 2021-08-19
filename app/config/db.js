'use strict';
const CONSTANTS = require('./constants');

const db = {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
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