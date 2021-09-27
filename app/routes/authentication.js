'use strict';

const BaseRoute = require('./baseRoute');
const { user: UserModel } = require('./../models');
const UtilsClass = require('./../services/utilities/utils');

class Authentication extends BaseRoute {
  constructor () {
    super('Authentication', false);

    /* POST ROUTES */
    this.post('/signin', this.handleUserSignIn.bind(this));
    this.post('/signup', this.handleUserSignUp.bind(this));
  }

  async handleUserSignIn (req) {
    const { body: { email, password } } = req;
    const Utils = new UtilsClass();

    if (!email || !password) {
      throw new Error('Missing email or password');
    }
    
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
      token: jwt.token,
      name: user.getFullName(),
      email: user.getEmail()
    };
  }

  async handleUserSignUp (req) {
    const { body: { firstName, lastName, email, password } } = req;    
    
    const userExists = await UserModel.findOne({
      where: {
        email
      }
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const Utils = new UtilsClass();

    const user = new UserModel({
      firstName,
      lastName,
      email,
      password,
      active: true
    });

    const createdUser = await user.save({
      attributes: { exclude: ['password'] }
    });

    const jwt = Utils.createJwt(createdUser);
    
    delete createdUser.dataValues.password;
    return {
      user: createdUser,
      token: jwt.token
    };
  }
}

module.exports = Authentication;
