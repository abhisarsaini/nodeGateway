var metricsLimiter = require('./metrics-limiter');
var tokenBucketLimiter = require('./token-bucket');

module.exports = function(options) {
  options = options || {};
  console.log(options);
  if (options.type === 'metrics') {
    return metricsLimiter(options);
  } else {
    return tokenBucketLimiter(options);
  }
};