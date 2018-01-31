/**
 * Application entry point for busyweb cli
 *
 */
const path = require('path');
require('./initializer');

const application = loader('lib/application');

// get application namespace
const app = application(__dirname);

// add busyweb namespace to process;
process.__busyweb = app;

loader('helpers/header')();
loader('helpers/version')();
loader('lib/load-commands')();

let hasArgs = false;
const args = process.argv.slice(2);
app.program.commands.forEach(cmd => {
	if (args[0] === cmd._name || args[0] === cmd._alias) {
		hasArgs = true;
		return;
	}
});

if (!hasArgs) {
	//const { isEmberCli } = loader('utils/ember');
	// TODO:
	// add logic here to add a throughput channel for ember-cli commands to be ran.
	//
	//if (isEmberCli()) {
	//	global.console.log('ember cli project');
	//} else {
	//	global.console.log('not an ember cli project');
	//}
	loader('helpers/help')();
}

const argv = process.argv;
argv[1] = path.join(__dirname, 'scripts', 'bw');

// parse args
app.program.parse(argv);
