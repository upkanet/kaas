//Use http to create server
let http = require('http');
//Use file system to read html pages
let fs = require('fs');
//Use robot to control computer inputs (-node10 version for last NodeJS compatibility)
let robot = require('robotjs-node10');
//Use panels
let panels = require('./panels')

//Specify port 1119 (for "K" "S" keyboard as a service)
var port = 1119;
//Activate verbose if requested
var verbose = (process.argv[2] == 'verbose');

//Create the server handler
let server = http.createServer(function(req,res){
	var jsres = {
		status: 200,
		message: null
	};

	if(req.method == 'POST'){
		//Start receiving data
		req.on('data', function(data) {
    		var cmd = JSON.parse(data);
    		try{
    			if(cmd.delay > 0){
    				var a = JSON.parse(JSON.stringify(cmd.args));
    				a.splice(1,0,'down');
    				console.log(a);
    				robot.keyToggle.apply(null,a);
    				a[1] = 'up';
    				console.log(cmd.delay, a);
    				setTimeout(function(){robot.keyToggle.apply(null,a);}, (Math.random()+0.5) * cmd.delay);
    			}
    			else{
    				robot[cmd.function].apply(null,cmd.args);
    			}
    		}
    		catch(e){
    			verbose ? console.error('Function error') : null;
    			jsres.status = 500;
    			jsres.message = "function error";
    		}
    		verbose ? console.log(cmd.function, cmd.args) : null;
    	});

		//End post request
		req.on('end',function(){
			res.writeHead(jsres.status, {'Content-Type': 'application/json'});
			verbose ? console.log(jsres) : null;
			res.end(JSON.stringify(jsres));
		});

	}
	else{
		verbose ? console.log('GET') : null;
		if(req.url === "/"){
			res.end(panels.list());
		}
		else if(req.url != '/favicon.ico'){
			res.end(panels.showPanel(req.url.substr(1)));
		}
	}
});


require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	console.log('KAAS server IP '+add+' on port '+port+'...');
});
verbose ? console.log('==Verbose mode==') : true;
server.listen(port);