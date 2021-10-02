'use strict';

const ContentDisposition = require('content-disposition');
const S3Class = require('./../../modules/s3');
const CONSTANTS = require('./../../config/constants');

class StorageService {
  constructor () {
    this.PRESIGNED_URL_EXPIRATION = 300;
    this.s3 = new S3Class().create();
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

  async getPresignedUrl (options) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: CONSTANTS.BUCKET_NAME,
      Key: options.key,
      Expires: this.PRESIGNED_URL_EXPIRATION,
      ResponseContentDisposition: ContentDisposition(`${options.filename}${options.extension}`),
      ResponseContentType: options.contentType,
      ResponseCacheControl: 'no-cache, no-store'
    });
  }

  async getFileReadStream (fileKey) {
    return this.s3.getObject({
      Bucket: CONSTANTS.BUCKET_NAME,
      Key: fileKey
    }).createReadPromise();
  }

  async uploadFile (fileKey, file) {
    return this.s3.upload({
      Bucket: CONSTANTS.BUCKET_NAME,
      Key: fileKey,
      Body: file,
      ACL: 'private'
    }).promise();
  }

  async getMetadata (fileKey) {
    return this.s3.headObject({
      Key: fileKey,
      Bucket: CONSTANTS.BUCKET_NAME
    }).promise();
  }

  async copy (options) {
    const params = {
      Key: options.destination,
      Bucket: CONSTANTS.BUCKET_NAME,
      CopySource: `/${CONSTANTS.BUCKET_NAME}/${options.source}`,
      MetadataDirective: 'COPY'
    };

    return this.s3.copyObject(params).promise();
  }
}

module.exports = StorageService;
