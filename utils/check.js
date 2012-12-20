var fs = require("fs");
var  jshint = require("./jshint");

var options = {
	camelcase: true,
	curly: true,
	eqeqeq: true,
	forin: true,
	immed: true,
	latedef: true,
	newcap: true,
	noarg: true,
	noempty: true,
	nonew: true,
	quotmark: "single",
	regexp: true,
	undef: true,
	unused: true,
	strict: true,
	globalstrict: true,
	trailing: true,
	maxparams: 4,
	maxdepth: 5,
	maxcomplexity: 10,
	maxlen: 80,
};

var clean = true;

var files = fs.readdirSync("./src");
for(var i = 0;i<files.length;i++){
	if(files[i].slice(-3) !== ".js"){
		continue;
	}
	var src = fs.readFileSync("./src/" + files[i],'utf8');
	if(jshint.JSHINT(src,options)){
		continue;
	}

	clean = false;

	errors = jshint.JSHINT.errors;
	for(var j = 0; j < errors.length; j++){
		var msg = files[i] + ":";
		msg += errors[j].line + " " + errors[j].reason;
		console.log(msg);
	}
};
