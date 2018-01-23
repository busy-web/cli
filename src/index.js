/**
 * Application entry point for busyweb cli
 *
 */
const application = require('./lib/application');

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
	if (args[0] === cmd._name) {
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

// parse args
app.program.parse(process.argv);
