
const logger = loader('utils/logger');
const colors = loader('colors', true);

module.exports = function() {
	logger.write(colors.white.dim.italic(" version: " + process.__package.version), "\n");
};
