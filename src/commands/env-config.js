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
		options: [ 
			{ cmd: '--path <path>', short: '-p', desc: 'path/to/folder where file config changes are. ( default: Current Working Directory )' },
			{ cmd: '--file <name>', short: '-f', desc: 'filename to replace config settings for. ( default: index.html )' },
			{ cmd: '--require', short: '-r', desc: 'throw error if config or ENV settings do not exist. ( default: false )' },
		],
		run: config
	}),
	config
};
