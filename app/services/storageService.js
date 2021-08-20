'use strict';

const s3 = new (require('./../modules/s3'))();
const CONSTANTS = require('./../config/constants');

class StorageService {
  constructor () {
    this.PRESIGNED_URL_EXPIRATION = 300;
    this.s3 = s3.create();
  }

  async setupBuckets () {
    const bucketExists = await new Promise((resolve) => {
      this.s3.headBucket({ Bucket: CONSTANTS.BUCKET_NAME }, (err, data) => {
        if (err) {
          resolve(false);
        }

        resolve(true);
      });
    });
    
    return new Promise((resolve, reject) => {
      if (bucketExists) {
        resolve();
      }

      this.s3.createBucket({ Bucket: CONSTANTS.BUCKET_NAME }, (err, data) => {
        if (err) {
          reject(err);
        }
        
        resolve(data);
      });
    });
  }

  async getPresignedUrl (fileKey) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: CONSTANTS.BUCKET_NAME,
      Key: fileKey,
      Expires: this.PRESIGNED_URL_EXPIRATION
    });
  }

  async getFileReadStream (fileKey) {
    return this.s3.getObject({
      Bucket: CONSTANTS.BUCKET_NAME,
      Key: fileKey
    }).createReadPromise();
  }

  async uploadFile (fileKey, file) {
    return new Promise((resolve, reject) => {
      this.s3.putObject({
        Bucket: CONSTANTS.BUCKET_NAME,
        Key: fileKey,
        Body: file,
        ACL: 'private'
      }, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }
}

module.exports = StorageService;
