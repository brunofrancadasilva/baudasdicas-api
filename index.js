'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const CONSTANTS = require('./app/config/constants');
const { sequelize, Sequelize } = require('./app/models');
const ApiManager = require('./app/managers/apiManager');
const StorageServiceClass = require('./app/services/storageService');
const sequelizeMigrate = require('./app/modules/sequelizeMigrate');

const app = express();

const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Headers', 'Cookie, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Accept-Encoding, Authorization, Accept-Language');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// instanciate routes
new ApiManager(app);

// initialize database
const PORT = CONSTANTS.PORT;

setupCore()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  }).catch(e => {
    console.log(e);
    throw e;
  });

// initialize core features
async function setupCore() {
  const StorageService = new StorageServiceClass();

  if (CONSTANTS.IS_PROD_ENV) {
    await sequelizeMigrate.migrate({
      sequelize: sequelize,
      SequelizeImport: Sequelize,
      migrationsDir: './db_scripts/migrations/'
    });
  } else {
    await sequelize.authenticate();
  }
  
  return StorageService.setupBuckets();
}
