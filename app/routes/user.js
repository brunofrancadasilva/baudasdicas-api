'use strict';

const BaseRoute = require('./baseRoute');

class User extends BaseRoute {
  constructor () {
    super('User', true);

    this.get('/', this.handleBase.bind(this));
  }

  handleBase (req) {
    return {};
  }
}

module.exports = User;