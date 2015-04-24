var quotaLimiter = require('./quota');
var spikeLimiter = require('./spike-arrest');

module.exports = function(options) {
  options = options || {};
  console.log(options);
  if (options.type === 'quota') {
    return quotaLimiter(options);
  } else {
    return spikeLimiter(options);
  }
};