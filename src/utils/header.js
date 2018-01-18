
const logger = loader('utils/logger');
const colors = loader('colors', true);

module.exports = function() {
	logger.write(colors.yellow(" ______  _     _ _______ __   __ _  _  _ _______ ______ "));
	logger.write(colors.yellow(" |_____] |     | |______   \\_/   |  |  | |______ |_____]"));
	logger.write(colors.yellow(" |_____] |_____| ______|    |    |__|__| |______ |_____]"));
	logger.write(colors.yellow("                                                        "));
};
