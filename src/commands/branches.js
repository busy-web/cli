/**
 * @module Commands
 *
 */
const cmd = loader('utils/cmd');
const createCommand = loader('utils/create-command');
const path = require('path');

function branches() {
	const dirname = path.join(process.__busyweb.dirname, 'scripts');
	const script = 'git-branches.sh';
	return cmd(`sh ${dirname}/${script}`, { hidecmd: true }).then(str => {
		return `git branch\n----------------------------------------\n${str}\n----------------------------------------\n`;
	});
}

const Command = createCommand({
	name: 'branches',
	description: 'show git branches and descriptions',
	alias: 'br',
	args: [],
	options: [],
	run: branches
});

module.exports = {
	default: Command,
	branches
};
