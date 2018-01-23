/**
 * @module Commands
 * 
 */
const createCommand = loader('utils/create-command');

module.exports = createCommand({
	name: 'docker',
	description: 'injects docker config into built ember app',
	args: ['<action>', '<ember-setting>:<docker-setting>', '...'],
	
	options: [
		//{ cmd: '--tag', short: '-t', desc: 'checkout a tag and deploy it to the build server' }
	],

	run(action, ...args) {
		if (action === 'config') {
			require('./../helpers/docker-config')(args);
		}
	}
});
