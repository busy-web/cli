/**
 * @module utils
 *
 */
const { exec } = require('child_process');
const RSVP = require('rsvp');
const colors = require('colors');
const ora = require('ora');
const logger = loader('utils/logger');


module.exports = function(arg, opts={}) {
	if (!opts.hidecmd) {
		logger.write(colors.green('=> ') + colors.blue(arg));
	}

	const spinner = ora('running', { color: 'blue' });
	spinner.start();
	return new RSVP.Promise(resolve => {
		const proc = exec(arg, (err, stdout, stderr) => {
			spinner.stop();
			if (err) {
				if (!opts.ignoreError) {
					throw new Error(stderr);
				} else if (process.debug) {
					logger.err(err, stdout);
				}
			} else {
				resolve(stdout);
			}
		});

		if (opts.verbose) {
			proc.stdout.on('data', data => {
				logger.print(data);
			});
		}
	});
}
