
const colors = require('colors');
const logger = loader('utils/logger');

module.exports = function help() {
	const { program } = process.__busyweb;
	
	program.help(function() {
		let help = colors.white.italic("  Usage: \n");
		help += colors.white.dim("    busyweb <command> [options]\n");
		help += "\n";
		help += colors.white.italic("  Example:\n");
		help += colors.white.dim("    busyweb help => print usage information\n");
		help += "\n";
		help += colors.white.italic("  Commands:\n");

		program.commands.forEach(cmd => {
			help += cmd.helpInfo();
		});

		logger.write(help);
		return '';
	});
}
