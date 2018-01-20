/**
 * @module Commands
 * 
 */
//import RSVP from 'rsvp';
import createCommand from 'busyweb/utils/create-command';
//import cmd from 'busyweb/utils/cmd';
//import logger from 'busyweb/utils/logger';

export default createCommand({
	name: 'local',
	description: 'util to help manage and maintain local dev environment',
	alias: 'l',
	args: ['<build>'],
	
	options: [
		{ cmd: '--tag', short: '-t', desc: 'checkout a tag and deploy it to the build server' }
	],
	
	//run(build) {
		
	//}
});
