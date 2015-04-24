// https://github.com/jhurliman/node-rate-limiter
// https://github.com/apigee-127/volos/tree/master/quota/
var debug = console.log;
var RateLimiter = require('limiter').RateLimiter;
var keys = require('./keys.json').keys;

module.exports = function(options) {
	options = options || {};
	var limit = options.limit || 1000;
	var interval = options.interval || 1000;
	var type = options.type || 'rate-limit';

	var limiters = {};

	return function quotaLimiting(req, res, next) {

		var limiter;
		var key = getKey(req, res);
		if (key) {
			limiter = limiters[key];
			if (!limiter) {
				debug('Creating rate limiter for %s : %d %d', type, limit,
						interval);
				limiter = new RateLimiter(limit, interval);
				limiters[key] = limiter;
			}

			var ok = limiter.tryRemoveTokens(1);
			var remaining = Math.floor(limiter.getTokensRemaining());
			var reset = Math.max(interval
					- (Date.now() - limiter.curIntervalStart), 0);

			debug('\n[Key:%s]\n \'%s\' limit\t= Total Limit: %d Remaining: %d Reset: %d',
					key, type, limit, remaining, reset);
			res.setHeader('Quota-Limit', limit);
			res.setHeader('Quota-Remaining', remaining);
			res.setHeader('Quota-Reset', reset);

			if (!ok) {
				console.log('******Blocked by: ' + type);
				res.status(429).json({
					error : 'Quota exceeded'
				});
				return;
			}
		} else {
			console.log('******No user found******* ');
			res.status(401).json({
				unauthorised : 'Not registered.'
			});
			return;
		}
		next();
	};
};

/**
 * Build the key for rate limiting from the request
 * @param {Request} req The request object
 * @returns {string} The rate limiting key
 */
function getKey(req, res) {
	var index = keys.indexOf(req.query.apiKey);
	if (index != -1) {
		return keys[index];
	} else {
		return;
	}
}
