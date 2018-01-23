/**
 * @module Commands
 * 
 */
const createCommand = loader('utils/create-command');
const logger = loader('utils/logger');

module.exports = createCommand({
	name: 'deploy',
	description: 'deploy build to server',
	alias: 'd',
	args: ['<docker|canary|alpha|beta|staging|prod|production>'],
	
	options: [
		//{ cmd: '--tag', short: '-t', desc: 'checkout a tag and deploy it to the build server' }
	],
	
	run(build) {
		logger.log('command not supported yet.', build);	
	}
});
