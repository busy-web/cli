/**
 * @modules utils
 * 
 */
import path from 'path';
//import cmd from 'busyweb/utils/cmd';

/***/

/**
 *
 */
export function isEmberCli() {
	const dirname = process.cwd();
	const pkg = require(path.join(dirname, 'package.json'));
	let version = pkg.devDependencies['ember-cli'];
	return typeof version === 'string' && version.length
}

