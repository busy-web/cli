/**
 * @module Commands
 * 
 */
const createCommand = loader('utils/create-command');
const config = require('../scripts/bw-env-config');

module.exports = { 
	default: createCommand({
		name: 'env:config',
		alias: 'env:c',
		description: 'injects ENV variables into and ember app config/environment',
		args: ['<EMBER_CONFIG.PATH:ENV_VAR...>'],
		options: [],
		run: config
	}),
	config
};
