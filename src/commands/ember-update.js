/**
 * @module Commands
 * 
 */
const createCommand = loader('utils/create-command');
const cmd = loader('utils/cmd');
const logger = loader('utils/logger');

module.exports = createCommand({
	name: 'ember:update',
	description: 'update ember-cli locally or globally',
	alias: 'em:up',
	args: ['[version]'],
	
	options: [
		{ cmd: '--global', short: '-g', desc: 'update global ember install' },
		{ cmd: '--dry', short: '-d', desc: 'performs a dry run where no update will be performed' },
	],
	
	run(version) {
		version = version && version.length ? `@${version}` : '';
		let list = this.program.global ? 'global list' : 'list';
		cmd(`yarn ${list} --depth=0 --pattern ember-cli --no-progress --json`).then((emberver) => {
			if (/ember-cli@/.test(emberver)) {
				if (!this.program.global) {
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
							if (!this.program.dry) {
								let add = this.program.global ? 'global add' : 'add --dev';
								cmd(`yarn ${add} ember-cli${version}`, { verbose: true });
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
