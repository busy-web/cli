/**
 * @module Commands
 *
 */
const cmd = loader('utils/cmd');
const createCommand = loader('utils/create-command');

function update() {
	return cmd('yarn install --silent --pure-lockfile');
}

const Command = createCommand({
	name: 'dev:update',
	description: 'install missing packages',
	alias: 'dev:up',
	args: [],
	options: [],
	run: update
});

module.exports = {
	default: Command,
	update
};
