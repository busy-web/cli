/**
 * @module Commands
 * 
 */
const createCommand = loader('utils/create-command');
const logger = loader('utils/logger');

module.exports = createCommand({
	name: 'docker',
	deprecated: 'Please use `env:config` inplace of `docker config`',
	description: 'injects docker config into built ember app',
	args: ['<config>', '<EMBER_CONFIG.PATH:DOCKER_ENV...>'],
	options: [],
	run(action, args) {
		logger.warn("DEPRECATED: `busy-web docker config` is deprecated please convert to using `busy-web env:config`");

		if (action === 'config') {
			require('./../scripts/bw-env-config')(args);
		}
	}
});
