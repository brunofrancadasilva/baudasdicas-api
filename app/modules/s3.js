'use strict';

const CONSTANTS = require('../config/constants');
const AWS = require('aws-sdk');
const spacesEndpoint = new AWS.Endpoint(CONSTANTS.STORAGE_ENDPOINT);

class S3 {
  create () {
    return new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: CONSTANTS.STORAGE_KEY,
      secretAccessKey: CONSTANTS.STORAGE_SECRET
    });
  }
}

module.exports = S3;