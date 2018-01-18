
const fs = require("fs");
const path = require('path');

module.exports = function(program, appdir) {
	fs.readdirSync(path.join(appdir, 'commands')).forEach(function(file) {
		require(path.join(appdir, 'commands', file))(program);
	});
}
