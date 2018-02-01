
const colors = require('colors');
const { assert, isDefined, isArray } = loader('utils/types');

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

module.exports = function createCommand(opts) {
	assert("createCommand takes and object <options> as a required argument", isDefined(opts) && typeof opts === 'object');
	assert("name must exist. `opts.name = 'command name';`", isDefined(opts.name));
	assert("args must exist as a descriptor for the type of allowed arguments. `opts.args: ['<arg1>', '<arg2>', '[options]']", isArray(opts.args));
	assert("description must exist. `opts.description = 'description';`", isDefined(opts.description));
	assert("options must exist. `opts.options [ { cmd: '--dostuff', short: '-d', desc: 'It does something', args: [], type: typeFunc(){} } ]", isDefined(opts.options));

	let run = function() {};
	let prog;

	return function Command(program) {
		if (opts.run) {
			run = opts.run;
		}

		const cmd = `${opts.name} ${opts.args.join(' ')}`.trim();
		prog = program.command(cmd);

		if (opts.alias) {
			prog.alias(opts.alias);
		}

		prog.description(opts.description);

		opts.options.forEach(opt => {
			let { name, desc, type } = parseOption(opt);
			prog.option(name, desc, type);
		});

		prog.helpInfo = function() {
			let help = colors.blue('    ' + opts.name + ' ' + colors.italic(opts.args.join(' ')) + "\n");
			if (opts.deprecated) {
				help += "      " + colors.bgYellow.gray("DEPRECATED: ") + colors.bgYellow.gray.italic(opts.deprecated) + "\n";
			}

			if (opts.description && opts.description.length) {
				help += '      ' + colors.white.dim(opts.description) + "\n";
			}

			if (opts.alias && opts.alias.length) {
				help += colors.blue(colors.yellow.italic(`      Alias: ${opts.alias}`)) + "\n";
			}

			if (opts.options && opts.options.length) {
				help += colors.yellow.italic('      Options:') + "\n";
				opts.options.forEach(opt => {
					let { name, desc } = parseOption(opt);
					if (desc && desc.length) {
						desc = ' ' + colors.white.dim(desc);
					} else {
						desc = '';
					}

					help += '        ' + colors.green(name) + desc + "\n";
				});
			}

			help += (process.__busyweb.boring) ? "" : "\n"
			return help;
		};

		this.program = prog;
		prog.action((...args) => {
			if (run) {
				let res = run.apply(this, args);
				if (res && res.then) {
					process.__busyweb.runPromise = res;
				} else {
					process.__busyweb.runResult = res;
				}
			}
		});
	}
}
