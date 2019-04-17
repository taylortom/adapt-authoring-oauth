const {Module} = require('adapt-authoring-core');
const path = require('path');

/**
* Adds OAuth-based authentication and authorisation to the application.
* @extends {Module}
*/
class OAuth extends Module {
  /**
  * Adds the middleware
  */
  preload(app, resolve, reject) {
    app.getModule('server').addApiMiddleware(this.authenticate.bind(this), this.authorise.bind(this));
    resolve();
  }

  authenticate(req, res, next) {
    this.log('info', `Skipping authentication for ${req.originalUrl}`);
    return next();

    if(!req.headers.authorization) {
      this.log('debug', `Blocked unauthenticated attempt to access ${req.originalUrl}`);
      return new Responder(res).error('Failed to authenticate', 401);
    }
    this.log('debug', `Allowed authenticated attempt to access ${req.originalUrl}`);
    next();
  }
  authorise(req, res, next) {
    this.log('info', `Skipping authorisation for ${req.originalUrl}`);
    return next();

    this.log('debug', `Allowed authorised attempt to access ${req.originalUrl}`);
    next();
  }
}

module.exports = OAuth;
