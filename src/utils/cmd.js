/**
 * @module utils
 *
 */
const { exec } = require('child_process');
const RSVP = require('rsvp');
const colors = require('colors');

const logger = loader('utils/logger');


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
