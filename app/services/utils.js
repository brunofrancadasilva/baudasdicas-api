'use strict';

const jwt = require('jsonwebtoken');
const CONSTANTS = require('../config/constants');

class Utils {
  createJwt (user) {
    const payload = {
      id: user.getId(),
      email: user.getEmail(),
      active: user.isActive()
    };

    const token = jwt.sign(payload, CONSTANTS.JWT_SECRET, {
      expiresIn: CONSTANTS.JWT_EXPIRATION
    });

    return {
      payload,
      token
    };
  }
}

module.exports = Utils;