
const { assert, isDefined, isArray } = loader('utils/types');
const logger = loader('utils/logger');
const colors = require('colors');

function parseOption(opt) {
	let { cmd, short, desc, args, type } = opt;
	if (!/^--/.test(cmd)) {
		cmd = `--${cmd}`;
	}
	
	if (!/^-/.test(short)) {
		short = `-${short}`;
	}
	
	args = args || [];
	let name = `${short}, ${cmd} ${args.join(' ')}`.trim();
	return { name, desc, type };
}

module.exports = function Command (program) {
	assert("name must exist. `this.name = 'command name';`", isDefined(this.name));
	assert("args must exist as a descriptor for the type of allowed arguments. `get args() { return [ ... ]; } => ['<arg1>', '<arg2>', '[options]']", isArray(this.args));
	assert("description must exist. `this.description = 'description';`", isDefined(this.description));
	assert("options must exist. `get options() { return { ... }; } => {'dostuff': ['-d', 'It does something'], 'help': ['-h', 'shows help', typeFunc]", isDefined(this.options));

	const cmd = `${this.name} ${this.args.join(' ')}`.trim();
	this.p = program.command(cmd);
	this.p.description(this.description);

	this.options.forEach(opt => {
		let { name, desc, type } = parseOption(opt);
		this.p.option(name, desc, type);
	});

	this.p.on('--help', () => {
		logger.write('');
		logger.write('----');
		logger.write('');
		logger.write('  ' + this.name + ' ' + colors.italic(this.args.join(' ')));

		if (this.description && this.description.length) {
			logger.write('    ' + colors.white.dim(this.description));
		}

		if (this.alias && this.alias.length) {
			logger.write(colors.blue(colors.yellow.italic(`    - alias: ${this.alias}`)));
		}

		logger.write('');
		logger.write(colors.white.dim('    Options:'));
		this.options.forEach(opt => {
			let { name, desc } = parseOption(opt);
			if (desc && desc.length) {
				desc = ' ' + colors.white.dim(desc);
			} else {
				desc = '';
			}

			logger.write('      ' + colors.green(name) + desc);
		});
		logger.write('');
		logger.write('----');
	});

	this.p.action((...args) => this.run && this.run.apply(this, args));
}
