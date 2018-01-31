
const path = require('path');
const fs = require('fs');

module.exports = function(argv) {
	
	function get(target, key) {
		let args = key.split('.');
		let value = target;
		args.forEach(k => {
			if (value[k] !== undefined) {
				value = value[k];
			} else {
				return null;
			}
		});
		return value;
	}

	function set(target, key, value) {
		let keys = key.split('.');
		let child = keys.pop();
		let parent = keys.join('.');
		let pVal = get(target, parent);
		if (pVal && typeof pVal === 'object') {
			pVal[child] = value;
		} else {
			throw new Error('Error: the target at path key was not found or was not an object.');
		}
	}

	const cwd = process.cwd();
	const meta = `config\/environment`; // eslint-disable-line no-useless-escape
	const filePath = path.join(cwd, 'index.html');

	fs.readFile(filePath, 'UTF-8', (err, data) => {
		if (err) {
			throw new Error("index.html not found, run ember build <environment> first.");
		}

		const reg = new RegExp(`^(((?!${meta})[\\s\\S])*)(${meta}" content=")([^"]*)([\\s\\S]*)$`, 'g');
		const str = data.replace(reg, '$4');
		const json = JSON.parse(unescape(str));

		argv.forEach(function(arg, idx) {
			if (arg.hasOwnProperty(idx)) {
				let [ em, dm ] = arg.split(':');
				if (process.env[dm]) {
					if (!get(json, em))	{
						throw new Error(`Error: ${em} not found in application config`);
					} else {
						set(json, em, process.env[dm]);
					}
				}
			}
		});

		const resStr = escape(JSON.stringify(json));
		data = data.replace(reg, `$1$3${resStr}$5`);
		fs.writeFile(filePath, data, function(err) {
			if (err) {
				throw new Error(err);
			}
			console.log("Config settings changed! \n"); // eslint-disable-line no-console
		});
	});
};
