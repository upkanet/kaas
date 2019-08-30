let http = require('http');
let url = require('url');
let robot = require('robotjs-node10');


let server = http.createServer(function(req,res){
	
	var urlObj = url.parse(req.url, true, false);
	var query = urlObj.query;
	var cmd = Object.keys(query)[0];
	var arg = query[cmd];
	var headcode = 200;
	var resjson = {};

	console.log(cmd, arg);
	try{
		robot[cmd](arg);
		resjson = {'status':'OK','cmd':cmd,'arg':arg};
	}
	catch(error){
		console.error(query, error);
		headcode = 501;
		resjson = {'status':'error','query':query,'error':error};
	}

	res.writeHead(501, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(resjson));
});


console.log('KAAS server...');
server.listen(1119);