var http = require('http');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var url = require("url");
http.createServer(function handler(req, res) {

	var pathname = url.parse(req.url).pathname;
	if(pathname == "/upload"){
		proxy.web(req, res,{target: 'http://127.0.0.1:8081'});
		console.log('After calling new server, inside proxy.');
	}
	else{
		res.end('Hello from proxy server\n');
	}
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');


http.createServer(function(req, res) {
	console.log('Inside new node.');
	setTimeout(function() {
	    console.log('Waiting inside new node..');
	}, 3000);
	res.end("Request received on 8081");
	}).listen(8081);
