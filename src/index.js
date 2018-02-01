/**
 * Application entry point for busyweb cli
 *
 */
const path = require('path');
const colors = require('colors');
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

function exit(code) {
	let msg = colors.green('OK');
	if (code !== 0) {
		msg = colors.red('FAIL');
	}

	logger.write(process.__busyweb.boring ? "" : "\n", colors.yellow("< EXIT:"), msg, colors.yellow(">"));
	process.exit(code);
}

const logger = loader('utils/logger');
if (process.__busyweb.runPromise) {
	process.__busyweb.runPromise.then((res) => {
		logger.info(res && (res.message || res));
		exit(0);
	}).catch(err => {
		logger.error(err);
		exit(1);
	});
} else {
	if (process.__busyweb.runResult) {
		logger.info(process.__busyweb.runResult);
	}
	exit(0);
}
