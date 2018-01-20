/**
 * Application entry point for busyweb cli
 *
 */
import application from 'busyweb/lib/application';
import header from 'busyweb/helpers/header';
import version from 'busyweb/helpers/version';
import { isEmberCli } from 'busyweb/utils/ember';
import help from 'busyweb/helpers/help';
import manifest from 'busyweb/manifest';

// get application namespace
const app = application();

// add busyweb namespace to process;
process.__busyweb = app;

header();
version();
manifest();

let hasArgs = false;
const args = process.argv.slice(2);
app.program.commands.forEach(cmd => {
	if (args[0] === cmd._name) {
		hasArgs = true;
		return;
	}
});
	
if (!hasArgs) {
	// TODO:
	// add logic here to add a throughput channel for ember-cli commands to be ran.
	//
	//if (isEmberCli()) {
	//	global.console.log('ember cli project');
	//} else {
	//	global.console.log('not an ember cli project');
	//}
	help();
}

// parse args
app.program.parse(process.argv);
