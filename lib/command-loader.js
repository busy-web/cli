
const fs = require("fs");

module.exports = function(program, path) {
	fs.readdirSync(path + '/commands').forEach(function(file) {
		require(path + '/commands/' + file)(program);
	});
}
