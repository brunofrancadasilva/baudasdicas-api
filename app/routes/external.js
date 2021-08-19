'use strict';

const BaseRoute = require('./baseRoute');

class External extends BaseRoute {
  constructor () {
    super('External');

    /* GET ROUTES */
    this.get('/health', this.handleHealthCheck.bind(this));
  }

  async handleHealthCheck (req) {
    return {};
  }
}

module.exports = External;