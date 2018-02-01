/**
 * @module Commands
 *
 */
const RSVP = require('rsvp');
const cmd = loader('utils/cmd');
const createCommand = loader('utils/create-command');
const { clean } = loader('commands/dev-clean');

function install() {
	return clean().then((res) => {
		return cmd('ls', { hidecmd: true }).then(str => {
			let hasLockfile = /yarn\.lock/.test(str);
			let promise = RSVP.resolve();
			if (this.program.rebuild && hasLockfile) {
				hasLockfile = false;
				promise = cmd('rm yarn.lock', { ignoreError: true, hidecmd: true });
			}

			return promise.then(() => {
				let lockfile = hasLockfile ? '--pure-lockfile ' : '';
				return cmd(`yarn install ${lockfile}--silent`).then(() => {
					if (res.hasBower) {
						return cmd('bower install').then(() => "Install completed!");
					} else {
						return "Install completed!";
					}
				});
			});
		});
	});
}

const Command = createCommand({
	name: 'dev:install',
	description: 'clean project install fresh packages',
	alias: 'dev:i',
	args: [],
	options: [ { cmd: '--rebuild', short: '-r', desc: 'removes the lockfile and generates a new lockfile based on current package.json only on <install>' } ],
	run: install
});

module.exports = {
	default: Command,
	install
};
