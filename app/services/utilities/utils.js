'use strict';

const jwt = require('jsonwebtoken');
const CONSTANTS = require('./../../config/constants');

class Utils {
  createJwt (user) {
    const payload = {
      id: user.getId(),
      email: user.getEmail(),
      active: user.getIsActive()
    };

    const token = jwt.sign(payload, CONSTANTS.JWT_SECRET, {
      expiresIn: CONSTANTS.JWT_EXPIRATION
    });

    return {
      payload,
      token
    };
  }

  diffArray (st, nd, comparator) {
    return {
      added: st.filter(stItem => !(nd.find(ndItem => comparator(stItem, ndItem)))),
      removed: nd.filter(ndItem => !(st.find(stItem => comparator(stItem, ndItem)))),
      kept: st.filter(stItem => (nd.find(ndItem => comparator(stItem, ndItem))))
    };
  }

}

module.exports = Utils;
