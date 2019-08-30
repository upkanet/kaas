let http = require('http');
let url = require('url');
let robot = require('robotjs-node10');


let server = http.createServer(function(req,res){
	
	var urlObj = url.parse(req.url, true, false);
	var query = urlObj.query;
	var cmd = Object.keys(query)[0];
	var arg = query[cmd];

	console.log(cmd, arg);
	try{
		robot[cmd](arg);
	}
	catch(error){
		console.error(query, error);
	}

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end();
});


console.log('KAAS server...');
server.listen(1119);