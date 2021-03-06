/**
 * @modules Lib
 *
 */
const path = require('path');
const program = require('commander');

module.exports = function application(dirname) {

	const rootdir = path.dirname(dirname);
	const cwd = process.cwd();

	const pkg = require(path.join(rootdir, 'package.json'));

	/**
	 * application namespace
	 */
	const busyweb = { 
		title: 'busyweb',
		description: 'web dev cli tool for node and ember-cli',
		usage: 'busyweb <command> [options]',

		cwd,
		rootdir,
		dirname,
		
		debug: false,
		
		package: pkg,

		// program instance
		program,
		loader,

		runPromise: null
	};

	// set program app info
	program.name(busyweb.title);
	program.description(busyweb.description);
	program.usage(busyweb.usage);
	program.option('--boring', 'Hide title and version information and remove empty new lines');
	program.option('--debug', 'Turn debug mode on');

	let boring = process.argv.find(val => val === '-b' || val === '--boring');
	busyweb.boring = (boring !== undefined && boring !== null);
	
	let debug = process.argv.find(val => val === '-b' || val === '--debug');
	busyweb.debug = (debug !== undefined && debug !== null);

	return busyweb;
}
