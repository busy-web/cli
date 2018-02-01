/**
 * @module utils
 *
 */
const { exec, spawn } = require('child_process');
const RSVP = require('rsvp');
const colors = require('colors');
const ora = require('ora');
const logger = loader('utils/logger');

module.exports = function cmd(arg, opts={}) {
	if (!opts.hidecmd) {
		logger.write(colors.green('=> ') + colors.blue(arg));
	}

	let spinner;
	if (!opts.allowInput) {
		spinner = ora('running', { color: 'blue' });
		spinner.start();
	}
	
	return new RSVP.Promise((resolve, reject) => {
		if (opts.allowInput) {
			let args = arg.split(' ');
			let primary = args.shift();

			// create child process to run the cmd.
			const child = spawn(primary, args, { stdio: 'inherit' });

			child.on('close', () => {
				resolve();
			});
			
			child.on('error', err => {
				logger.error('child error', err);
				reject(err);
			});
		} else {
			// create child process to run the cmd.
			const child = exec(arg, { }, (err, stdout, stderr) => {
				if (spinner) { spinner.stop(); }

				if (err && opts.ignoreError) {
					logger.error(err, stderr);
				} else if (err) {
					// TODO: add check for `process.debug` before logger
					logger.error(stderr);
					reject(err);
				} else {
					resolve(stdout);
				}
			});
			
			if (opts.verbose) {
				child.stdout.on('data', data => {
					logger.print(data);
				});
			}
		}
	});
}

