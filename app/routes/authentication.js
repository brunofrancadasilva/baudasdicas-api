'use strict';

const BaseRoute = require('./baseRoute');
const db = require('./../models/index');
const UserModel = require('../models/user')(db.sequelize, db.Sequelize.DataTypes);
const Utils = new (require('./../services/utils'))();

class Authentication extends BaseRoute {
  constructor () {
    super('Authentication');

    /* POST ROUTES */
    this.post('/signin', this.handleUserSignIn.bind(this));
    this.post('/signup', this.handleUserSignUp.bind(this));
  }

  async handleUserSignIn (req) {
    const { body: { email, password } } = req;

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