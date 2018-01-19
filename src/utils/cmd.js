/**
 * @module utils
 *
 */
const { exec } = require('child_process');
const RSVP = require('rsvp');
//const colors = require('colors');
const ora = require('ora');
const logger = loader('utils/logger');


module.exports = function(arg, opts={}) {
	const spinner = ora({ color: 'green'}, '=> ' + arg).start();
	//logger.write(colors.green('=> ') + colors.blue(arg));
	return new RSVP.Promise(resolve => {
		const proc = exec(arg, (err, stdout, stderr) => {
			spinner.stop();
			if (err) {
				//logger.error(err, stderr);
				throw new Error(stderr);
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
