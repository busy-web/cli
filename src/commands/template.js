/**
 * @module Commands
 * 
 */
const resolve = require('resolve');
const path = require('path');
const fs = require('fs');
//const RSVP = require('rsvp');

const createCommand = loader('utils/create-command');
//const cmd = loader('utils/cmd');
const logger = loader('utils/logger');

module.exports = createCommand({
	name: 'template',
	description: 'creates a new template file. (not supported yet)',
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
				logger.log('resolve', name, meta, fd);
			});
		});
	}
});
