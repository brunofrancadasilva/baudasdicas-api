'use strict';

const express = require('express');
const jwtDecode = require('./../middlewares/jwtDecode');

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

    this._registerApi('post', {
      path,
      handler,
      ...options
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
    this._registerApi('get', {
      path,
      handler,
      ...options
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
    this._registerApi('put', {
      path,
      handler,
      ...options
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
    this._registerApi('delete', {
      path,
      handler,
      ...options
    });
  }

  _registerApi (httpMethod, params) {
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

    args.push(this._wrapper(params.handler, params.successCode));
    
    // register api
    this.router[httpMethod].apply(this.router, args);
  }

  _wrapper (handler, httpSuccessCode) {
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
}

module.exports = BaseRoute;