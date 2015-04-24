var http = require('http');
var url = require("url");
var loopback = require('loopback');
var app = module.exports = loopback();
var boot = require('loopback-boot');

//Proxy setup
var proxy = require('./middleware/proxy');
var proxyOptions = require('./middleware/proxy/config.json');

//Rate Limiting 
var rateLimiting = require('./middleware/rate-limiting');

//Starting proxy server.
app.listen(3000);
console.log('API Gateway Server running at http://127.0.0.1:3000');

// Key Verification

app.use(rateLimiting({type :'quota', limit: 10, interval: 20000}));
app.use(rateLimiting({type :'spike-arrest', limit: 3, interval: 3000}));

//routing via proxy server.
app.use(proxy(proxyOptions));