/**
 * @module utils
 *
 */
const { exec, spawn } = require('child_process');
const RSVP = require('rsvp');
const ora = require('ora');
const logger = loader('utils/logger');

module.exports = function cmd(arg, opts={}) {
	if (!opts.hidecmd) {
		logger.info(arg);
	}

	let spinner;
	if (!opts.allowInput) {
		spinner = ora('running', { color: 'blue' });
		spinner.start();
	}
	
	return new RSVP.Promise((resolve, reject) => {
		if (opts.allowInput) { 
			let [ primary, ...args ] = arg.split(' ');
			
			// create child process to run the cmd and allow ui input
			const child = spawn(primary, args, { stdio: 'inherit' });

			// regieter on close event to resolve promise
			child.on('close', () => resolve());

			// register error event to reject promise
			child.on('error', err => {
				if (process.__busyweb.debug) {
					logger.debug('[ CMDERR ]', err);
				}
				reject(err);
			});
		} else {
			// create child process to run the cmd with callback for promises
			const child = exec(arg, { }, (err, stdout, stderr) => {
				if (spinner) { spinner.stop(); }

				if (err && opts.ignoreError) {
					logger.error(err, stderr);
				} else if (err) {
					if (process.__busyweb.debug) {
						logger.debug('[ CMDERR ]', stderr);
					}
					reject(err);
				} else {
					resolve(stdout);
				}
			});
			
			if (opts.verbose || process.__busyweb.debug) {
				child.stdout.on('data', data => {
					logger.subinfo(data);
				});
			}
		}
	});
}

