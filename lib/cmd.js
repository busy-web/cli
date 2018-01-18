
const RSVP = require('rsvp');
const { exec } = require('child_process');
const colors = require('colors');
const logger = require('./logger');

module.exports = function(arg, opts={}) {
	logger.write(colors.green('=> ') + colors.blue(arg));
	return new RSVP.Promise(resolve => {
		const proc = exec(arg, (err, stdout, stderr) => {
			if (err) {
				logger.error(err, stderr);
			}
			resolve(stdout);
		});

		if (opts.verbose) {
			proc.stdout.on('data', data => {
				logger.print(data);
			});
		}
	});
}
