/**
 * @module utils
 *
 */
import { exec } from 'child_process';
import RSVP from 'rsvp';
import colors from 'colors';
import ora from 'ora';
import logger from 'busyweb/utils/logger';


export default function(arg, opts={}) {
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
