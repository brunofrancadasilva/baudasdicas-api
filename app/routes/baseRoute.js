'use strict';

const express = require('express');
const Busboy = require('busboy');
const jwtDecode = require('./../middlewares/jwtDecode');

function registerApi (httpMethod, params) {
  httpMethod = httpMethod.toLowerCase();
  const args = [];

  if (!params.path || typeof params.path != 'string') {
    throw new Error(`Missing 'path', or type of 'path' is not supported for API mapping. Please check your API mapping.`);
  } else if (!params.handler || typeof params.handler != 'function') {
    throw new Error(`Missing 'handler' on API mapping. Please check your API mapping for path '${params.path}'.`);
  }

  args.push(params.path);

  if (params.middleware && typeof params.middleware === 'function') {
    args.push(params.middleware);
  }

  args.push(apiHandlerWrapper(params.handler, params.successCode));
  
  // register api
  params.router[httpMethod].apply(params.router, args);
}

function apiHandlerWrapper (handler, httpSuccessCode) {
  return function (req, res) {
    const successCode = httpSuccessCode || 200;
    let promise;

    try {
      // wrap response into a promise
      promise = new Promise(resolve => {
        resolve(handler.apply(handler, arguments))
      });
    } catch (error) {
      res.status(500).json(error);
    }

    if (promise) {
      promise.then(response => {
        res.status(successCode).json(response);
      }).catch(e => {
        console.error(e);
        res.status(500).send(e.message);
      })
    } else {
      res.status(500).send('Request failed');
    }
  }
}

class BaseRoute {
  constructor (restName, requiresAuth) {
    this.router = express.Router();
    this.restName = restName;

    if (requiresAuth) {
      this.router.use(jwtDecode);
    }
  }

  getRestName () {
    return this.restName;
  }

  getRouter () {
    return this.router;
  }
  
  /**
   * @param {String} path
   * @param {Function} handler
   * @param {Object} options
   * @param {Function} options.middleware
   * @param {Number} options.successCode
   */
  post(path, handler, options = {}){
    options.successCode = options.successCode ? options.successCode : 201;

    registerApi('post', {
      path,
      handler,
      ...options,
      router: this.router,
    });
  }

  /**
   * @param {String} path
   * @param {Function} handler
   * @param {Object} options
   * @param {Function} options.middleware
   * @param {Number} options.successCode
   */
  get(path, handler, options = {}){
    registerApi('get', {
      path,
      handler,
      ...options,
      router: this.router,
    });
  }

  /**
   * @param {String} path
   * @param {Function} handler
   * @param {Object} options
   * @param {Function} options.middleware
   * @param {Number} options.successCode
   */
  put(path, handler, options = {}){
    registerApi('put', {
      path,
      handler,
      ...options,
      router: this.router,
    });
  }

  /**
   * @param {String} path
   * @param {Function} handler
   * @param {Object} options
   * @param {Function} options.middleware
   * @param {Number} options.successCode
   */
  delete(path, handler, options = {}){
    registerApi('delete', {
      path,
      handler,
      ...options,
      router: this.router,
    });
  }

  getFilesAndUploadToStorage (req, fileHandler) {
    const busboy = new Busboy({ headers: req.headers });
    
    return new Promise(resolve => {
      busboy.on('file', (type, fileStream, filename, encoding, mimetype) => {
        counter++;
        
        fileHandler({
          type,
          fileStream,
          filename,
          encoding,
          mimetype,
        }).then(() => {
          counter--;


        })
      });

      busboy.on('finish', () => {
        if (counter === 0) {
          resolve();
        }
      })      

      req.pipe(busboy);
    });
  }
}

module.exports = BaseRoute;
