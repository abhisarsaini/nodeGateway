// https://github.com/jhurliman/node-rate-limiter
// https://github.com/apigee-127/volos/tree/master/quota/
var debug = console.log;
var RateLimiter = require('limiter').RateLimiter;

module.exports = function(options) {
  //console.log(options);
  options = options || {};
  //console.log(options);
  var limit = options.limit || 1000;
  var interval = options.interval || 1000;
  var type = options.type || 'rate-limit';

  var limiters = {};

  return function spikeArrestLimiting(req, res, next) {

    var limiter;
    var key = (options.getKey || getKey)(req);
    if (key) {
      limiter = limiters[key];
      if (!limiter) {
        debug('Creating rate limiter for %s : %d %d',type, limit, interval);
        limiter = new RateLimiter(limit, interval);
        limiters[key] = limiter;
      }

      var ok = limiter.tryRemoveTokens(1);
      var remaining = Math.floor(limiter.getTokensRemaining());
      var reset = Math.max(interval - (Date.now() - limiter.curIntervalStart),
        0);

      debug('\'%s\' limit\t= Total Limit: %d Remaining: %d Reset: %d',type, limit, remaining, reset);
      res.setHeader('Spike-Limit', limit);
      res.setHeader('Spike-Remaining', remaining);
      res.setHeader('Spike-RateLimit-Reset', reset);

      if (!ok) {
    	console.log('******Blocked by: '+type);
        res.status(429).json({error: 'Spike detected!'});
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
