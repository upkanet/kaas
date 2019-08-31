// panels.js
// ========
let fs = require('fs');

module.exports = {
	template: fs.readFileSync("template.htm",'utf-8'),
	list: function () {
	    var pans = fs.readdirSync("panels");
	    pans.shift();
	    var content = "";
	    pans.forEach(function(p){
	    	var pname = p.substr(0,p.lastIndexOf('.'));
	    	content += '<a href="/'+pname+'">'+pname+'</a><br>';
	    });
	    return this.getPage(content);
	},
	showPanel: function (panelName) {
		var content = fs.readFileSync('panels/'+panelName+".htm",'utf-8');
		return this.getPage(content);
	},
	getPage(content){
		var page = this.template;
		return page.replace("{{content}}",content);
	}
};