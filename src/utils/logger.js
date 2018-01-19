
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
		console.log.apply(console, args);
	},

	print(...args) {
		this.write(colors.cyan(stringify(args)));
	},

	log(...args) {
		this.write(colors.grey(stringify(args)));
	},

	info(...args) {
		this.write("\n", colors.green(stringify(args)));
	},

	warn(...args) {
		this.write("\n", colors.yellow(stringify(args)));
	},

	error(...args) {
		args.unshift("ERROR: ");
		this.write("\n", colors.red(stringify(args)));
	}
};