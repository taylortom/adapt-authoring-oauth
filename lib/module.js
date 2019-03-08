const {Module} = require('adapt-authoring-core');
const path = require('path');

/**
*/
class OAuth extends Module {
  /**
  * Module to enable authentication/authorisation via OAuth
  */
  preload(app, resolve, reject) {
    resolve();
  }
}

module.exports = HelloWorld;
