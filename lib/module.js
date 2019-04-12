const {Module} = require('adapt-authoring-core');
const middleware = require('./middleware');
const path = require('path');

/**
*/
class OAuth extends Module {
  /**
  * Module to enable authentication/authorisation via OAuth
  */
  preload(app, resolve, reject) {
    const { authenticate, authorise } = middleware(app);
    // app.getModule('server').addApiMiddleware(authenticate, authorise);
    resolve();
  }
}

module.exports = OAuth;
