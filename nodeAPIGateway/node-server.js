var http = require('http');
var url = require("url");
var loopback = require('loopback');
var app = module.exports = loopback();
var boot = require('loopback-boot');
var proxy = require('./middleware/proxy');
var proxyOptions = require('./middleware/proxy/config.json');
var app = module.exports = loopback();

app.listen(3000);
app.use(proxy(proxyOptions));

console.log('Server running at http://127.0.0.1:3000/');

http.createServer(function(req, res) {
	console.log('Inside index node.');
	setTimeout(function() {
	    res.end("inside index node.");
	}, 3);
	
	}).listen(3001);


http.createServer(function(req, res) {
	console.log('Inside api node.');
	res.end("inside api node.");
	//res.end("Request received on 8082");
	
	
	}).listen(3002);

