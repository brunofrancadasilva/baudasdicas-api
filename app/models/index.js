'use strict';

const CONSTANTS = require('../config/constants');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = CONSTANTS.NODE_ENV;
const config = require('./../../database.js')[env];
const db = {};

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.PASSWORD, {
  host: config.DB_HOST,
  port: config.DB_PORT,
  dialect: config.dialect,
  isolationLevel: config.isolationLevel,
  pool: config.pool,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync('./../../ca-certificate.cer').toString()
    }
  }
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
