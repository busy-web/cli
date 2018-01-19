/**
 * @module Commands
 * 
 */
const RSVP = require('rsvp');
const createCommand = loader('utils/create-command');
const cmd = loader('utils/cmd');
const logger = loader('utils/logger');

module.exports = createCommand({
	name: 'local',
	description: 'util to help manage and maintain local dev environment',
	alias: 'l',
	args: ['<clean|update|install>'],
	
	options: [
		{ cmd: '--rebuild', short: '-r', desc: 'removes the lockfile and generates a new lockfile based on current package.json' }
	],
	
	run(task) {
		if (task === 'clean' || task === 'c') {
			return clean.call(this).then(() => {
				logger.info('local env is clean.');
			});
		} else if (task === 'update' || task === 'u') {
			return update.call(this).then(() => {
				logger.info('local env is updated');
			});
		} else if (task === 'install' || task === 'i') {
			return install.call(this).then(() => {
				logger.info('local env is installed');
			});
		}
	}
});

function clean() {
	return cmd('rm -rf node_modules').then(() => {
		return cmd('rm -rf tmp').then(() => {
			return cmd('rm -rf dist').then(() => {
				return cmd('ls bower_components').then(str => {
					if (str.length) {
						return cmd('rm -rf bower_components').then(() => {
							return cmd('bower cache clean');
						});
					} else {
						return RSVP.resolve();
					}
				});
			});
		});
	});
}

function update() {
	return cmd('yarn');
}

function install() {
	return clean().then(() => {
		return cmd('rm yarn.lock').then(() => {
			let lockfile = this.p.rebuild ? '' : '--pure-lockfile';
			return cmd(`yarn install ${lockfile} --non-interactive`);
		});
	});
}

