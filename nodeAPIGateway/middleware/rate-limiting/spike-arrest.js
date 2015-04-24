// https://github.com/jhurliman/node-rate-limiter
// https://github.com/apigee-127/volos/tree/master/quota/
var debug = console.log;
var RateLimiter = require('limiter').RateLimiter;

module.exports = function(options) {
  console.log(options);
  options = options || {};
  console.log(options);
  var limit = options.limit || 1000;
  var interval = options.interval || 1000;
  var name = options.name || 'rate-limit';

  var limiters = {};

  return function spikeArrestLimiting(req, res, next) {

    var limiter;
    //console.log('reached');
    var key = (options.getKey || getKey)(req);
    //debug('Key: %s', key);
    if (key) {
      limiter = limiters[key];
      if (!limiter) {
        debug('Creating rate limiter for %s : %d %d',name, limit, interval);
        //debug('Creating rate limiter : %d %d', limit, interval);
        limiter = new RateLimiter(limit, interval);
        limiters[key] = limiter;
      }

      var ok = limiter.tryRemoveTokens(1);
      //debug('Bucket: ', limiter.tokenBucket);
      var remaining = Math.floor(limiter.getTokensRemaining());
      var reset = Math.max(interval - (Date.now() - limiter.curIntervalStart),
        0);

      debug('\'%s\' limit\t= Total Limit: %d Remaining: %d Reset: %d',name, limit, remaining, reset);
      //debug('Limit: %d Remaining: %d Reset: %d', limit, remaining, reset);
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', reset);

      if (!ok) {
        res.status(429).json({error: 'Limit exceeded'});
        return;
      }
    }
    next();
  };
};

/**
 * Build the key for rate limiting from the request
 * @param {Request} req The request object
 * @returns {string} The rate limiting key
 */
function getKey(req) {
  var clientId = '123';
 // var clientApp = req.authInfo && req.authInfo.app;
 // if (clientApp) {
  //  clientId = clientApp.id;
  //}
  return 'client:' + clientId;
}
