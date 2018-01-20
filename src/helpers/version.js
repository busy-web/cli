
import colors from 'colors';
import logger from 'busyweb/utils/logger';

export default function version() {
	logger.write(colors.white.dim.italic(" version: " + process.__busyweb.package.version), "\n");
}
