
import colors from 'colors';
import logger from 'busyweb/utils/logger';

export default function header() {
	logger.write(colors.yellow(" ______  _     _ _______ __   __ _  _  _ _______ ______ "));
	logger.write(colors.yellow(" |_____] |     | |______   \\_/   |  |  | |______ |_____]"));
	logger.write(colors.yellow(" |_____] |_____| ______|    |    |__|__| |______ |_____]"));
}
