
const colors = require('colors');
const logger = loader('utils/logger');

module.exports = function header() {
	if (!process.__busyweb.boring) {
		logger.write(colors.yellow(" ______  _     _ _______ __   __ _  _  _ _______ ______ "));
		logger.write(colors.yellow(" |_____] |     | |______   \\_/   |  |  | |______ |_____]"));
		logger.write(colors.yellow(" |_____] |_____| ______|    |    |__|__| |______ |_____]"));
	}
}
