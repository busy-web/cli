
const colors = require('colors');
const logger = loader('utils/logger');

module.exports = function version() {
	logger.write(colors.white.dim.italic(" version: " + process.__busyweb.package.version), "\n");
}
