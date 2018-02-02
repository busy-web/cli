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

// load header
loader('helpers/header')();

// load version
loader('helpers/version')();

// load commands
loader('lib/load-commands')();

// validata args
let hasArgs = false;
const args = process.argv.slice(2);
app.program.commands.forEach(cmd => {
	if (args[0] === cmd._name || args[0] === cmd._alias) {
		hasArgs = true;
		return;
	}
});

// show help if non valid args found
if (!hasArgs) {
	loader('helpers/help')();
}

// fix arg1 bin argument for loaded scripts
const argv = process.argv;
argv[1] = path.join(__dirname, 'scripts', 'bw');

// parse args
app.program.parse(argv);

/**
 * helper method for shutting down program
 *
 */
function exit(code) {
	let msg = colors.green('[ OK ]');
	if (code !== 0) {
		msg = colors.red('[ FAIL ]');
	}

	logger.write(process.__busyweb.boring ? "" : "\n", msg, colors.yellow("busy-web finished"), "\n");
	process.exit(code);
}

// Log command results and exit program
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
