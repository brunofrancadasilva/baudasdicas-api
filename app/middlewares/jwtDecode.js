'use strict';

const CONSTANTS = require('./../config/constants');
const { user: UserModel } = require('./../models');
const basePassportStrategy = require('./../services/basePassportStrategy');
const Passport = require('passport');
const PassportJwt = require('passport-jwt');
const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;

function fromCookieHeader (req) {
  let token = null;
  
  if (req && req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  return token;
}

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromUrlQueryParameter('jwt'),
    fromCookieHeader
  ]),
  secretOrKey: CONSTANTS.JWT_SECRET,
  passReqToCallback: true
};

Passport.use(new JwtStrategy(options, async (req, jwtPayload, done) => {
  const user = await UserModel.findByPk(jwtPayload.id);

  if (!user) {
    return done(new Error(`User ${jwtPayload.id} not found`), false);
  }

  if (!user.active) {
    return done(new Error(`User ${jwtPayload.id} is not active`), false);
  }

  req.user = user;

  return done(null, user);
}));

const strategy = basePassportStrategy(
  Passport.authenticate('jwt', { session: false })
);

module.exports = strategy;
