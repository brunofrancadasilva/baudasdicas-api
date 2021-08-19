'use strict';

module.exports = (strategyHandler, customInterceptor) => {
  return function (req, res, next) {
    function nextInterceptor (error) {
      if (typeof customInterceptor === 'function') {
        customInterceptor.call(
          customInterceptor,
          arguments[0],
          arguments[1],
          req,
          res,
          next
        );
      } else if (error && error instanceof Error) {
        throw error;
      } else {
        next.apply(next, arguments);
      }
    }

    strategyHandler.call(strategyHandler, req, res, nextInterceptor);
  };
};