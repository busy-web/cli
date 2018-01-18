
function assert(msg, test) {
	if (!test) {
		throw new Error(msg);
	}
}

function isDefined(value) {
	return value !== undefined && value !== null;
}

function isArray(value) {
	return isDefined(value) && Array.isArray(value);
}


function Command (program) {
	assert("name must exist. `this.name = 'command name';`", isDefined(this.name));
	assert("args must exist as a descriptor for the type of allowed arguments. `get args() { return [ ... ]; } => ['<arg1>', '<arg2>', '[options]']", isArray(this.args));
	assert("description must exist. `this.description = 'description';`", isDefined(this.description));
	assert("options must exist. `get options() { return { ... }; } => {'dostuff': ['-d', 'It does something'], 'help': ['-h', 'shows help', typeFunc]", isDefined(this.options));

	const cmd = `${this.name} ${this.args.join(' ')}`.trim();
	this.p = program.command(cmd);
	
	if (isDefined(this.alias)) {
		this.p.alias(this.alias);
	}
	
	this.p.description(this.description);

	Object.keys(this.options).forEach(key => {
		let cmd = `--${key}`;
		let [ short, desc, type ] = this.options[key];
		if (!/^-/.test(short)) {
			short = `-${short}`;
		}
		this.p.option(`${short}, ${cmd}`, desc, type);
	});

	this.p.action((...args) => this.run && this.run.apply(this, args));
}

module.exports = function createCommand(opts) {
	return function(program) {
		this.name = opts.name;
		this.description = opts.description;
		this.alias = opts.alias;
		this.args = opts.args;
		this.options = opts.options;

		if (opts.run) {
			this.run = opts.run;
		}

		Command.call(this, program);
	}
}
