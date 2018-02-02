
const colors = require('colors');
const logger = loader('utils/logger');

module.exports = function version() {
	if (!process.__busyweb.boring) {
		logger.write(colors.yellow.italic(" version: " + process.__busyweb.package.version), "\n");
	}
}
