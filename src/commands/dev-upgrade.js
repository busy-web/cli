/**
 * @module Commands
 *
 */
const cmd = loader('utils/cmd');
const createCommand = loader('utils/create-command');

function upgrade() {
	return cmd('yarn upgrade-interactive', { allowInput: true }).then(() => "Upgrade complete!");
}

const Command = createCommand({
	name: 'dev:upgrade',
	description: 'update packages and regenerate yarn.lock file',
	alias: 'dev:u',
	args: [],
	options: [],
	run: upgrade
});

module.exports = {
	default: Command,
	upgrade
};
