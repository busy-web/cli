/**
 * @modules utils
 * 
 */
const path = require('path');
//const cmd = loader('utils/cmd');

/***/

/**
 *
 */
function isEmberCli() {
	const dirname = process.cwd();
	const pkg = require(path.join(dirname, 'package.json'));
	let version = pkg.devDependencies['ember-cli'];
	return typeof version === 'string' && version.length
}

module.exports = {
	isEmberCli
};
