/**
 * @module Commands
 * 
 */
import createCommand from 'busyweb/utils/create-command';

export default createCommand({
	name: '%name%',

	/**
	 * description that will be displayed when 
	 * busyweb help is ran.
	 *
	 */
	description: '%desc%',
	
	/**
	 * set an alias for the command
	 *
	 * @example
	 *	`busyweb template` can be called  as `busyweb t`
	 */
	alias: '',

	/**
	 * list out arguments here
	 *
	 * @example
	 *	['<arg1>', '<arg2>', '[opt1]']
	 */
	args: [],
	
	/**
	 * option command args go here
	 *
	 * @example: 
	 *	{ cmd: '--somethingcool', short: '-s', desc: 'does something cool.' }
	 */
	options: [],
	
	/**
	 * This is where the work is done.
	 */
	run(/*arg1, arg2, opt1*/) { }
});
