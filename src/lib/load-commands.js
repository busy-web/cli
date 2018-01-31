
const fs = require("fs");
const path = require('path');

module.exports = function() {
	const commands = [];
	fs.readdirSync(path.join(process.__busyweb.dirname, 'commands')).forEach(function(file) {
		let Command = require(path.join(process.__busyweb.dirname, 'commands', file));
		Command = Command.default || Command;

		if (typeof Command === 'function') {
			commands.push(new Command(process.__busyweb.program));
		}
	});
	return commands;
}
