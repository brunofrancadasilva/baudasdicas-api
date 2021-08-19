'use strict';

const express = require('express');
const cors = require('cors');
const CONSTANTS = require('./app/config/constants');
const db = require('./app/models/index');
const ApiManager = require('./app/managers/apiManager');
const storageService = new (require('./app/services/storageService'))();

const app = express();

const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// instanciate routes
new ApiManager(app);

// initialize database
const PORT = CONSTANTS.PORT;

setupCore()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  });;

// initialize core features
async function setupCore() {
  await storageService.setupBuckets();
  await db.sequelize.authenticate();
  
  return Promise.resolve();
}
