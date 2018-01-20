/**
 * @modules Lib
 *
 */
import program from 'commander';
import pkg from '../package.json';

export default function application() {

	/**
	 * application namespace
	 */
	const busyweb = { 
		title: 'busyweb',
		description: 'web dev cli tool for node and ember-cli',
		usage: 'busyweb <command> [options]',
		
		debug: false,
		
		package: pkg,

		// program instance
		program
	};

	// set program app info
	program.name(busyweb.title);
	program.description(busyweb.description);
	program.usage(busyweb.usage);
	
	return busyweb;
}
