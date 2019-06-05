const {Module} = require('adapt-authoring-core');
const path = require('path');

const bcrypt = require('bcryptjs');
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
    
    const data = {
      phrase: 'helloworld',
      results: [],
      testRounds: 3,
      maxTime: 1, // max time for hash function in seconds
      work: 10
    };
    this.testWork(data).then(() => {
      console.log(data.results);
      data.work = Math.round(data.results.reduce((t,v) => t+v, 0)/data.results.length);
      this.log('info', `set hash rounds to ${data.work} based on hardware performance`);
      resolve();
    });
  }

  testWork(data) {
    const start = process.hrtime.bigint();
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(data.work, (err, salt) => {
        bcrypt.hash(data.phrase, salt, (err, hash) => {
          const duration = Number(process.hrtime.bigint()-start)/1000000000;

          if(duration < data.maxTime) {
            data.work++;
            return this.testWork(data).then(resolve);
          }
          data.results.push(data.work);

          if(data.results.length < data.testRounds) {
            data.work = 10;
            return this.testWork(data).then(resolve);
          }
          resolve();
        });
      });
    });
  }
  /**
  * Checks that the user has permission to access the API
  * @param {ClientRequest} req The client request object
  * @param {ServerResponse} res The server response object
  * @param {function} next The next middleware function in the stack
  */
  authenticate(req, res, next) {
    this.log('info', `Skipping authentication for ${req.originalUrl}`);
    return next();

    if(!req.headers.authorization) {
      this.log('debug', `Blocked unauthenticated attempt to access ${req.originalUrl}`);
      return new Responder(res).error('Failed to authenticate', { statusCode: 401 });
    }
    this.log('debug', `Allowed authenticated attempt to access ${req.originalUrl}`);
    next();
  }
  /**
  * Checks that the user has permission to access the requested resource
  * @param {ClientRequest} req The client request object
  * @param {ServerResponse} res The server response object
  * @param {function} next The next middleware function in the stack
  */
  authorise(req, res, next) {
    this.log('info', `Skipping authorisation for ${req.originalUrl}`);
    return next();

    this.log('debug', `Allowed authorised attempt to access ${req.originalUrl}`);
    next();
  }
}

module.exports = OAuth;
