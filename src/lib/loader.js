/**
 * @module Lib
 *
 */
const path = require('path');

module.exports = function(appdir) {
	return function loader(file, isNode=false) {
		if (isNode) {
			return require(file);
		}
		return require(path.join(appdir, file));
	}
};
