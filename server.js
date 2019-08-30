//Use http to create server
let http = require('http');
//Use url to play with resquest url
let url = require('url');
//Use robot to control computer inputs (-node10 version for last NodeJS compatibility)
let robot = require('robotjs-node10');

//Specify port 1119 (for "K" "S" keyboard as a service)
var port = 1119;
//Check server command line arguments
var myArgs = process.argv.slice(2);
//Activate verbose if requested
var verbose = (myArgs[0] == 'verbose');

let server = http.createServer(function(req,res){
	
	var urlObj = url.parse(req.url, true, false);
	var query = urlObj.query;
	var cmd = Object.keys(query)[0];
	var arg = query[cmd];
	var headcode = 200;
	var resjson = {};

	if(req.url == '/favicon.ico'){
		verbose ? console.log('Catch favicon') : true;
		headcode = 204;
		resjson = {'status':'error','message':'favicon.ico not found'};
	}
	else{
		try{
			verbose ? console.log(cmd, arg) : true;
			robot[cmd](arg);
			resjson = {'status':'OK','cmd':cmd,'arg':arg};
		}
		catch(error){
			verbose ? console.error(query, error) : true;
			headcode = 501;
			resjson = {'status':'error','query':query,'error':error};
		}
	}

	res.writeHead(headcode, {'Content-Type': 'application/json'});
	res.end(JSON.stringify(resjson));
});


console.log('KAAS server on port '+port+'...');
verbose ? console.log('==Verbose mode==') : true;
server.listen(port);