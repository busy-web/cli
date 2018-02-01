
const colors = require('colors');
const logger = loader('utils/logger');

module.exports = function help() {
	const { program } = process.__busyweb;
	
	program.help(function() {
		let help = colors.white.italic("  Usage: \n");
		help += colors.white.dim("    busyweb <command> [options]\n");
		help += (process.__busyweb.boring) ? "" : "\n"
		
		help += colors.white.italic("  OPTIONS:\n");
		program.options.forEach(item => {
			help += "    " + colors.green(item.flags) + " " + colors.white.dim(item.description) + "\n";
		});
		help += (process.__busyweb.boring) ? "" : "\n"
		
		help += colors.white.italic("  Example:\n");
		help += colors.white.dim("    busyweb help => print usage information\n");
		help += (process.__busyweb.boring) ? "" : "\n"
		
		help += colors.white.italic("  Commands:\n");

		let cmds = program.commands.sort((a, b) => {
			if (a._name > b._name) { return 1; } 
			else if (a._name < b._name) { return -1; } 
			else { return 0; }
		});

		cmds.forEach(cmd => {
			if (cmd && cmd.helpInfo) {
				help += cmd.helpInfo();
			}
		});

		logger.write(help);
		return '';
	});
}
