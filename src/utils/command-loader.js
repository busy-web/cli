
const fs = require("fs");
const path = require('path');

module.exports = function(program, appdir) {
	const commands = [];
	fs.readdirSync(path.join(appdir, 'commands')).forEach(function(file) {
		const Command = require(path.join(appdir, 'commands', file));
		commands.push(new Command(program));
	});
	return commands;
}
