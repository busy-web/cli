/**
 * @module Commands
 * 
 */
const createCommand = loader('utils/create-command');
const logger = loader('utils/logger');

module.exports = createCommand({
	name: 'deploy',
	description: 'deploy build to server. ARGS build: [ docker | canary | alpha | beta | staging | prod | production ] ( not supported yet )',
	alias: 'd',
	args: ['<build>'],
	
	options: [],
	
	run(build) {
		logger.log('command not supported yet.', build);	
	}
});
