'use strict';

const BaseRoute = require('./baseRoute');

class User extends BaseRoute {
  constructor () {
    super('User', true);
  }
}

module.exports = User;