/**
 * @module Commands
 * 
 */
const createCommand = loader('utils/create-command');

module.exports = createCommand({
	name: 'docker',
	description: 'injects docker config into built ember app',
	args: ['config', '<EMBER_CONFIG.PATH:DOCKER_ENV>', '[...]'],
	
	options: [],

	run(action, ...args) {
		if (action === 'config') {
			require('./../helpers/docker-config')(args);
		}
	}
});
