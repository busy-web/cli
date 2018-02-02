
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

	log(...args) {
		this.write(colors.magenta(' => Log:'), stringify(args));
	},
	
	debug(...args) {
		this.write(colors.cyan(' => Debug:'), stringify(args));
	},
	
	subinfo(...args) {
		this.write(colors.green('     =>'), colors.cyan(stringify(args)));
	},

	info(...args) {
		this.write(colors.green(' =>'), colors.blue(stringify(args)));
	},

	warn(...args) {
		this.write(colors.yellow(' => Warning:'), stringify(args));
	},

	error(...args) {
		this.write(colors.red(' => Error:'), stringify(args));
	}
};
