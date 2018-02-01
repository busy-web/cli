/**
 * @module Commands
 * 
 */
const RSVP = require('rsvp');
const { install } = require('./dev-install');
const createCommand = loader('utils/create-command');
const cmd = loader('utils/cmd');

module.exports = createCommand({
	name: 'ember:init',
	description: 'installs new files from the current installed version of ember-cli. (ember:update should be ran first)',
	alias: 'em:i',
	args: [],
	
	options: [
		{ cmd: '--diff', short: '-d', desc: 'use git difftool to merge files after init' },
	],
	
	run() {
		return cmd(`yarn list --depth=0 --pattern ember-cli --no-progress --json`).then((emberver) => {
			if (/ember-cli@/.test(emberver)) {
				return cmd(`ember init`, { allowInput: true }).then(() => {
					if (!this.program.diff) {
						return RSVP.resolve("Ember init complete!");
					}

					return cmd(`git difftool`, { allowInput: true }).then(() => {
						this.program.rebuild = true;
						return install.call(this).then(() => {
							return RSVP.resolve("Ember init merge complete!");
						});
					});
				});
			} else {
				return RSVP.reject("ember-cli is not installed locally");
			}
		});
	}
});
