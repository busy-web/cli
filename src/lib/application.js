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
		loader
	};

	// set program app info
	program.name(busyweb.title);
	program.description(busyweb.description);
	program.usage(busyweb.usage);
	
	return busyweb;
}
