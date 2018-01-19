
const path = require('path');
const root = path.dirname(__dirname);
const pkg = require(path.join(root, 'package.json'));
process.__appdir = __dirname;
process.__package = pkg;

const program = require('commander');

// set program
program.name(process.title);
program.description('web dev cli tool for node and ember-cli');
program.usage('busyweb <command> [options]');

global.loader = require('./utils/loader')(__dirname);

global.loader('utils/header')();
global.loader('utils/version')();

// load programm commands
global.loader('utils/command-loader')(program, __dirname);

let hasArgs = false;
const args = process.argv.slice(2);
program.commands.forEach(cmd => {
	if (args[0] === cmd._name) {
		hasArgs = true;
		return;
	}
});

if (!hasArgs) {
	const logger = loader('utils/logger');
	const colors = require('colors');
	program.help(function() {
		let help = colors.white.italic("  Usage: \n");
		help += colors.white.dim("    busyweb <command> [options]\n");
		help += "\n";
		help += colors.white.italic("  Example:\n");
		help += colors.white.dim("    busyweb help => print usage information\n");
		help += "\n";
		help += colors.white.italic("  Commands:\n");

		program.commands.forEach(cmd => {
			help += cmd.helpInfo();
		});

		logger.write(help);
		return '';
	});
}

// parse args
program.parse(process.argv);
