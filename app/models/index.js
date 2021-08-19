'use strict';

const CONSTANTS = require('../config/constants');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = CONSTANTS.NODE_ENV;
const config = require('./../../database.js')[env];
const db = {};

const sequelize = new Sequelize(CONSTANTS.DB_NAME, CONSTANTS.DB_USER, CONSTANTS.PASSWORD, {
  host: CONSTANTS.DB_HOST,
  port: CONSTANTS.DB_PORT,
  dialect: config.dialect,
  isolationLevel: config.isolationLevel,
  pool: config.pool
});

fs
  .readdirSync(path.join(__dirname))
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.resolve(__dirname, file))(sequelize, Sequelize.DataTypes);

    db[model.name] = model;
  });
  
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
