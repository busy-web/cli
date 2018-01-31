/**
 * @module Commands
 *
 */
const RSVP = require('rsvp');
const cmd = loader('utils/cmd');
const createCommand = loader('utils/create-command');

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

const command = createCommand({
	name: 'dev:clean',
	description: 'remove packages, and build files',
	alias: 'dev:c',
	args: [],
	options: [],
	run: clean,
});

module.exports = {
	default: command,
	clean
};
