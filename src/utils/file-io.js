
const RSVP = require('rsvp');
const fs = require('fs');

function read(fp, encoding="UTF-8") {
	return new RSVP.Promise((resolve, reject) => {
		fs.readFile(fp, encoding, (err, data) => {
			if (err) { return reject(err); }
			return resolve(data);
		});
	});
}

function write(fp, data) {
	return new RSVP.Promise((resolve, reject) => {
		fs.writeFile(fp, data, (err) => {
			if (err) { return reject(err); }
			return resolve(true);
		});
	});
}

module.exports = { read, write };
