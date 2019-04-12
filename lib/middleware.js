const { Responder } = require('adapt-authoring-core');
/**
* Functions to be used as Express middleware
* @type {Object}
*/
 function middleware(instance) {
   return {
     authenticate: (req, res, next) => {
       instance.log('info', `Skipping authentication for ${req.originalUrl}`);
       return next();

       if(!req.headers.authorization) {
         instance.log('debug', `Blocked unauthenticated attempt to access ${req.originalUrl}`);
         return new Responder(res).error('Failed to authenticate', 401);
       }
       instance.log('debug', `Allowed authenticated attempt to access ${req.originalUrl}`);
       next();
     },
     authorise: (req, res, next) => {
       instance.log('info', `Skipping authorisation for ${req.originalUrl}`);
       return next();

       instance.log('debug', `Allowed authorised attempt to access ${req.originalUrl}`);
       next();
     }
   };
};

module.exports = middleware;
