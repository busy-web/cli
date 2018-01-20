/**
 * @module Commands
 * 
 */
import resolve from 'resolve';
import path from 'path';
import fs from 'fs';

import createCommand from 'busyweb/utils/create-command';
//import RSVP from 'rsvp';
//import cmd from 'busyweb/utils/cmd';
//import logger from 'busyweb/utils/logger';

export default createCommand({
	name: 'template',
	description: 'creates a new template file',
	alias: 't',
	args: ['<type>', '<name>'],
	
	options: [
		{ cmd: '--delete', short: '-d', desc: 'deletes a template file' }
	],
	
	run(type, name) {
		const cwd = process.cwd();
		const file = path.join(cwd, 'templates', type);
		return resolve(file, function(err, res) {
			if (err) {
				throw new Error(err);
			}
			const meta = require(res);
			fs.open(path.join(file, 'file.js'), 'r+', (err, fd) => {
				console.log('resolve', name, meta, fd);
			});
		});
	}
});
