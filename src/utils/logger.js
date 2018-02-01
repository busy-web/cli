
const colors = require('colors');

function stringify(args) {
	let str = [];
	args.forEach(a => {
		if (a === undefined) {
			a = 'undefined';
		} else if (a === null) {
			a = 'null';
		}

		if (typeof a === 'object' || Array.isArray(a)) {
			a = JSON.stringify(a);
		}
		str.push(a);
	});
	return str.join(' ');
}

module.exports = {
	write(...args) {
		console.log.apply(console, args); // eslint-disable-line no-console
	},

	print(...args) {
		this.write(colors.green('  =>'), colors.cyan(stringify(args)));
	},

	log(...args) {
		this.write(colors.green('  =>'), colors.white.dim(stringify(args)));
	},

	info(...args) {
		this.write(process.__busyweb.boring ? "" : "\n", colors.green(' =>'), colors.blue(stringify(args)));
	},

	warn(...args) {
		this.write(process.__busyweb.boring ? "" : "\n", colors.yellow(' =>'), colors.yellow(stringify(args)));
	},

	error(...args) {
		args.unshift("ERROR:");
		this.write(process.__busyweb.boring ? "" : "\n", colors.red(' =>'), colors.red(stringify(args)));
	}
};
