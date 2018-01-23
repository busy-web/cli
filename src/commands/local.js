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
		{ cmd: '--rebuild', short: '-r', desc: 'removes the lockfile and generates a new lockfile based on current package.json only on <install>' }
	],
	
	run(task) {
		if (task === 'clean' || task === 'c') {
			return clean.call(this).then(() => {
				logger.info('Local environment is clean.');
			});
		} else if (task === 'update' || task === 'u') {
			return update.call(this).then(() => {
				logger.info('Local environment is updated');
			});
		} else if (task === 'install' || task === 'i') {
			return install.call(this).then(() => {
				logger.info('Local environment is installed');
			});
		}
	}
});

function clean() {
	return cmd('rm -rf node_modules', { ignoreError: true }).then(() => {
		return cmd('rm -rf tmp', { ignoreError: true }).then(() => {
			return cmd('rm -rf dist', { ignoreError: true }).then(() => {
				return cmd('ls -al', { hidecmd: true }).then(str => {
					if (/\.bowerrc/.test(str)) {
						return cmd('rm -rf bower_components', { ignoreError: true }).then(() => {
							return cmd('bower cache clean').then(() => ({ hasBower: true }));
						});
					} else {
						return RSVP.resolve({ hasBower: false });
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
	return clean().then((res) => {
		return cmd('ls', { hidecmd: true }).then(str => {
			let hasLockfile = /yarn\.lock/.test(str);
			let promise = RSVP.resolve();
			if (this.program.rebuild) {
				hasLockfile = false;
				promise = cmd('rm yarn.lock', { ignoreError: true, hidecmd: true });
			}

			return promise.then(() => {
				let lockfile = hasLockfile ? '--pure-lockfile ' : '';
				return cmd(`yarn install ${lockfile}--non-interactive`).then(() => {
					if (res.hasBower) {
						return cmd('bower install').then(() => res);
					} else {
						return res;
					}
				});
			});
		});
	});
}

