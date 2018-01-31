
if (!global.loader) {
	const loader = require('./lib/loader')(__dirname);
	global.loader = loader;
}
