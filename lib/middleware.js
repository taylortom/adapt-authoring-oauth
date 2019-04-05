const Logger = require('adapt-authoring-logger');
const { Responder } = require('adapt-authoring-core');
/**
* Functions to be used as Express middleware
* @type {Object}
*/
 function middleware(instance) {
   return {
     authenticate: (req, res, next) => {
       if(!req.headers.authorization) {
         Logger.log('debug', 'Blocked unauthenticated attempt to access the API');
         return new Responder(res).error('Failed to authenticate', 401);
       }
       Logger.log('debug', `Allowed authenticated attempt to access the API ${req.headers.authorization}`);
       next();
     },
     authorise: (req, res, next) => {
       Logger.log('debug', `Allowed authorised attempt to access the API`);
       next();
     }
   };
};

module.exports = middleware;
