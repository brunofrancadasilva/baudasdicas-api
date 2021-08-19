'use strict';
const fs = require('fs');
const path = require('path');

class ApiManager {
  constructor(app) {
    fs.readdir(path.resolve(__dirname + '/../routes'), (err, files) => {
      files.forEach(file => {
        if (file === 'baseRoute.js') {
          return
        }

        const classObj = require(path.resolve(__dirname + '/../routes/' + file));
        const instance = new classObj();

        app.use('/' + instance.getRestName(), instance.getRouter());
      });
    });
  }
}

module.exports = ApiManager;