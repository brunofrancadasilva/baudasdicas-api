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

console.error('CONNECTING DB');
setupCore()
  .then(() => {
    console.error('CONNECTED');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  }).catch(e => {
    console.log(e);
    console.log('FAILED CONNECT DB');
  });

// initialize core features
async function setupCore() {
  return Promise.all([
    storageService.setupBuckets(),
    db.sequelize.authenticate()
  ]);
}
