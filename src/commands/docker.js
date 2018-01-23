/**
 * @module Commands
 * 
 */
import createCommand from 'busyweb/utils/create-command';

export default createCommand({
	name: 'docker',
	description: 'injects docker config into built ember app',
	args: ['<action>', '<ember-setting>:<docker-setting>', '...'],
	
	options: [
		//{ cmd: '--tag', short: '-t', desc: 'checkout a tag and deploy it to the build server' }
	],

	run(action) {
		if (action === 'config') {
			const args = arguments;
			args.shift();
			require('./../helpers/docker-config')(args);
		}
	}
});
