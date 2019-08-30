let http = require('http');
let url = require('url');
let robot = require('robotjs-node10');

var port = 1119;


let server = http.createServer(function(req,res){
	
	var urlObj = url.parse(req.url, true, false);
	var query = urlObj.query;
	var cmd = Object.keys(query)[0];
	var arg = query[cmd];
	var headcode = 200;
	var resjson = {};

	if(req.url == '/favicon.ico'){
		headcode = 204;
		resjson = {'status':'error','message':'favicon.ico not found'};
	}
	else{
		try{
			robot[cmd](arg);
			resjson = {'status':'OK','cmd':cmd,'arg':arg};
		}
		catch(error){
			console.error(query, error);
			headcode = 501;
			resjson = {'status':'error','query':query,'error':error};
		}
	}

	res.writeHead(headcode, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(resjson));
});


console.log('KAAS server on port '+port+'...');
server.listen(port);