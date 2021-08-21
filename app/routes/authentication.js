'use strict';

const BaseRoute = require('./baseRoute');
const { user: UserModel } = require('./../models');
const UtilsClass = require('./../services/utilities/utils');

class Authentication extends BaseRoute {
  constructor () {
    super('Authentication');

    /* POST ROUTES */
    this.post('/signin', this.handleUserSignIn.bind(this));
    this.post('/signup', this.handleUserSignUp.bind(this));
  }

  async handleUserSignIn (req) {
    const { body: { email, password } } = req;
    const Utils = new UtilsClass();

    const user = await UserModel.findOne({
      where: {
        email
      }
    });

    if (!user) {
      throw new Error('Incorrect e-mail/password');
    }

    const passwordMatches = await user.matchPassword(password);

    if (!passwordMatches) {
      throw new Error('Incorrect e-mail/password');
    }

    const jwt = Utils.createJwt(user);

    return {
      token: jwt.token
    };
  }

  async handleUserSignUp (req) {
    const { body: { firstName, lastName, email, password } } = req;
    const Utils = new UtilsClass();
    
    const user = new UserModel({
      firstName,
      lastName,
      email,
      password,
      active: true
    });

    const createdUser = await user.save();
    const jwt = Utils.createJwt(createdUser);
    
    return {
      user: createdUser,
      token: jwt.token
    };
  }
}

module.exports = Authentication;
