

module.exports = function(appdir, pkg) {
	const program = require('commander');

	process.__appdir = appdir;
	process.__package = pkg;

	// set program
	program.name(process.title);
	program.description('web dev cli tool for node and ember-cli');
	program.version(pkg.version);
	
	global.loader = require('./utils/loader')(appdir);

	global.loader('utils/header')();
	global.loader('utils/version')();

	// load programm commmands
	global.loader('utils/command-loader')(program, appdir);

	// parse args
	program.parse(process.argv);
};
