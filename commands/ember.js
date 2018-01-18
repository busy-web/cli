
const createCommand = require('../lib/command');
const cmd = require('../lib/cmd');
const logger = require('../lib/logger');

module.exports = createCommand({
	name: 'ember',
	description: 'check ember-cli version',
	alias: 'e',
	args: [],
	
	options: {
		global: ['-g', 'use global ember install'],
		update: ['-u', 'update ember if its out of date']
	},
	
	run() {
		cmd(`yarn ${this.p.global ? 'global list' : 'list'} --depth=0 --pattern ember-cli --no-progress --json`).then((emberver) => {
			if (/ember-cli@/.test(emberver)) {
				if (!this.p.global) {
					emberver = JSON.parse(emberver);
					emberver = emberver.data.trees.map(d => {
						let [ pkg, version ] = d.name.split('@');
						return { pkg, version };
					}).find(d => d.pkg === 'ember-cli');
				} else {
					emberver = `[${emberver}]`;
					emberver = emberver.replace(/\n{/g, ',{').replace(/^,/, '');
					emberver = JSON.parse(emberver)
						.filter(d => typeof d.data === 'string')
						.map(d => {
							d = d.data.replace(/^[^"]*"([^"]*)"[\s\S]*$/, '$1');
							let [ pkg, version ] = d.split('@');
							return { pkg, version };
						}).find(d => d.pkg === 'ember-cli');
				}

				if (emberver && emberver.version) {
					cmd('yarn info ember-cli version').then(latest => {
						latest = latest.split('\n');
						latest = latest[1];
						if (emberver.version === latest) {
							logger.info('ember-cli is up to date.');
						} else {
							logger.info('ember-cli is out of date. Latest version is: ' + latest);
							if (this.p.update) {
								cmd(`yarn ${this.p.global ? 'global add' : 'add --dev'} ember-cli`, { verbose: true });
							}
						}
					});
				}
			} else {
				logger.error("ember-cli is not installed locally");
			}
		});
	}
});
