(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "name": "@busy-web/cli",
  "version": "0.1.2",
  "description": "Command line tools to enhance web dev tasks",
  "main": "src/index.js",
  "bin": {
    "busyweb": "./bin/busyweb"
  },
  "preferGlobal": true,
  "repository": "git@github.com:busy-web/cli.git",
  "author": "busy inc",
  "license": "MIT",
  "devDependencies": {
    "aliasify": "^2.1.0",
    "babel-core": "^6.26.0",
    "babel-preset-env": "^1.6.1",
    "babelify": "^8.0.0",
    "browserify": "^15.2.0",
    "colors": "^1.1.2",
    "commander": "^2.13.0",
    "gulp": "^3.9.1",
    "gulp-babel": "^7.0.0",
    "gulp-concat": "^2.6.1",
    "ora": "^1.3.0",
    "rsvp": "^4.7.0",
    "through": "^2.3.8",
    "vinyl-source-stream": "^2.0.0"
  }
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createCommand = require('/Sources/@busy-web/cli/src/utils/create-command');

var _createCommand2 = _interopRequireDefault(_createCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import cmd from '/Sources/@busy-web/cli/src/utils/cmd';
//import logger from '/Sources/@busy-web/cli/src/utils/logger';

exports.default = (0, _createCommand2.default)({
	name: 'local',
	description: 'util to help manage and maintain local dev environment',
	alias: 'l',
	args: ['<build>'],

	options: [{ cmd: '--tag', short: '-t', desc: 'checkout a tag and deploy it to the build server' }]

	//run(build) {

	//}
}); /**
     * @module Commands
     * 
     */
//import RSVP from 'rsvp';

},{"/Sources/@busy-web/cli/src/utils/create-command":14}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @module Commands
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _createCommand = require('/Sources/@busy-web/cli/src/utils/create-command');

var _createCommand2 = _interopRequireDefault(_createCommand);

var _cmd = require('/Sources/@busy-web/cli/src/utils/cmd');

var _cmd2 = _interopRequireDefault(_cmd);

var _logger = require('/Sources/@busy-web/cli/src/utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createCommand2.default)({
	name: 'ember',
	description: 'check ember-cli version',
	alias: 'e',
	args: [],

	options: [{ cmd: '--global', short: '-g', desc: 'use global ember install' }, { cmd: '--update', short: '-u', desc: 'update ember if its out of date' }],

	run: function run() {
		var _this = this;

		(0, _cmd2.default)('yarn ' + (this.p.global ? 'global list' : 'list') + ' --depth=0 --pattern ember-cli --no-progress --json').then(function (emberver) {
			if (/ember-cli@/.test(emberver)) {
				if (!_this.p.global) {
					emberver = JSON.parse(emberver);
					emberver = emberver.data.trees.map(function (d) {
						var _d$name$split = d.name.split('@'),
						    _d$name$split2 = _slicedToArray(_d$name$split, 2),
						    pkg = _d$name$split2[0],
						    version = _d$name$split2[1];

						return { pkg: pkg, version: version };
					}).find(function (d) {
						return d.pkg === 'ember-cli';
					});
				} else {
					emberver = '[' + emberver + ']';
					emberver = emberver.replace(/\n{/g, ',{').replace(/^,/, '');
					emberver = JSON.parse(emberver).filter(function (d) {
						return typeof d.data === 'string';
					}).map(function (d) {
						d = d.data.replace(/^[^"]*"([^"]*)"[\s\S]*$/, '$1');

						var _d$split = d.split('@'),
						    _d$split2 = _slicedToArray(_d$split, 2),
						    pkg = _d$split2[0],
						    version = _d$split2[1];

						return { pkg: pkg, version: version };
					}).find(function (d) {
						return d.pkg === 'ember-cli';
					});
				}

				if (emberver && emberver.version) {
					(0, _cmd2.default)('yarn info ember-cli version').then(function (latest) {
						latest = latest.split('\n');
						latest = latest[1];
						if (emberver.version === latest) {
							_logger2.default.info('ember-cli is up to date.');
						} else {
							_logger2.default.info('ember-cli is out of date. Latest version is: ' + latest);
							if (_this.p.update) {
								(0, _cmd2.default)('yarn ' + (_this.p.global ? 'global add' : 'add --dev') + ' ember-cli', { verbose: true });
							}
						}
					});
				}
			} else {
				_logger2.default.error("ember-cli is not installed locally");
			}
		});
	}
});

},{"/Sources/@busy-web/cli/src/utils/cmd":13,"/Sources/@busy-web/cli/src/utils/create-command":14,"/Sources/@busy-web/cli/src/utils/logger":16}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _rsvp = require('rsvp');

var _rsvp2 = _interopRequireDefault(_rsvp);

var _createCommand = require('/Sources/@busy-web/cli/src/utils/create-command');

var _createCommand2 = _interopRequireDefault(_createCommand);

var _cmd = require('/Sources/@busy-web/cli/src/utils/cmd');

var _cmd2 = _interopRequireDefault(_cmd);

var _logger = require('/Sources/@busy-web/cli/src/utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module Commands
 * 
 */
exports.default = (0, _createCommand2.default)({
	name: 'local',
	description: 'util to help manage and maintain local dev environment',
	alias: 'l',
	args: ['<clean|update|install>'],

	options: [{ cmd: '--rebuild', short: '-r', desc: 'removes the lockfile and generates a new lockfile based on current package.json' }],

	run: function run(task) {
		if (task === 'clean' || task === 'c') {
			return clean.call(this).then(function () {
				_logger2.default.info('Local environment is clean.');
			});
		} else if (task === 'update' || task === 'u') {
			return update.call(this).then(function () {
				_logger2.default.info('Local environment is updated');
			});
		} else if (task === 'install' || task === 'i') {
			return install.call(this).then(function () {
				_logger2.default.info('Local environment is installed');
			});
		}
	}
});


function clean() {
	return (0, _cmd2.default)('rm -rf node_modules', { ignoreError: true }).then(function () {
		return (0, _cmd2.default)('rm -rf tmp', { ignoreError: true }).then(function () {
			return (0, _cmd2.default)('rm -rf dist', { ignoreError: true }).then(function () {
				return (0, _cmd2.default)('ls -al', { hidecmd: true }).then(function (str) {
					if (/\.bowerrc/.test(str)) {
						return (0, _cmd2.default)('rm -rf bower_components', { ignoreError: true }).then(function () {
							return (0, _cmd2.default)('bower cache clean').then(function () {
								return { hasBower: true };
							});
						});
					} else {
						return _rsvp2.default.resolve({ hasBower: false });
					}
				});
			});
		});
	});
}

function update() {
	return (0, _cmd2.default)('yarn');
}

function install() {
	var _this = this;

	return clean().then(function (res) {
		return (0, _cmd2.default)('ls', { hidecmd: true }).then(function (str) {
			var hasLockfile = /yarn\.lock/.test(str);
			var promise = _rsvp2.default.resolve();
			if (_this.p.rebuild) {
				hasLockfile = false;
				promise = (0, _cmd2.default)('rm yarn.lock', { ignoreError: true, hidecmd: true });
			}

			return promise.then(function () {
				var lockfile = hasLockfile ? '--pure-lockfile ' : '';
				return (0, _cmd2.default)('yarn install ' + lockfile + '--non-interactive').then(function () {
					if (res.hasBower) {
						return (0, _cmd2.default)('bower install').then(function () {
							return res;
						});
					} else {
						return res;
					}
				});
			});
		});
	});
}

},{"/Sources/@busy-web/cli/src/utils/cmd":13,"/Sources/@busy-web/cli/src/utils/create-command":14,"/Sources/@busy-web/cli/src/utils/logger":16,"rsvp":undefined}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _rsvp = require('rsvp');

var _rsvp2 = _interopRequireDefault(_rsvp);

var _createCommand = require('/Sources/@busy-web/cli/src/utils/create-command');

var _createCommand2 = _interopRequireDefault(_createCommand);

var _cmd = require('/Sources/@busy-web/cli/src/utils/cmd');

var _cmd2 = _interopRequireDefault(_cmd);

var _logger = require('/Sources/@busy-web/cli/src/utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildType(release, version) {
	return 'npm version ' + version + '-' + release + '.1';
} /**
   * @module Commands
   *
   */


var buildTypes = {
	docker: function docker(version) {
		return buildType('dev', version);
	},
	canary: function canary(version) {
		return buildType('canary', version);
	},
	alpha: function alpha(version) {
		return buildType('alpha', version);
	},
	beta: function beta(version) {
		return buildType('beta', version);
	},
	staging: function staging(version) {
		return buildType('staging', version);
	},
	prod: function prod(version) {
		if (/-/.test(version)) {
			version = version.split('-')[0];
			return 'npm version ' + version;
		} else {
			return 'npm version patch';
		}
	},
	patch: function patch(version) {
		if (/-/.test(version)) {
			return 'npm version prerelease';
		} else {
			return 'npm version patch';
		}
	},
	minor: function minor() {
		return 'npm version --no-git-tag-version minor';
	},
	major: function major() {
		return 'npm version --no-git-tag-version major';
	}
};

function getNextVersion(version) {
	var mode = 'patch';
	if (/-/.test(version)) {
		mode = 'prerelease';
	}
	return (0, _cmd2.default)('npm version --no-git-tag-version ' + mode, { hidecmd: true }).then(function (newver) {
		newver = normailzeResponse(newver);
		newver = newver.split('-')[0];
		return (0, _cmd2.default)('npm version --no-git-tag-version ' + version, { hidecmd: true }).then(function (oldver) {
			oldver = normailzeResponse(oldver);
			return { newver: newver, oldver: oldver };
		});
	});
}

function normailzeResponse(str) {
	return str.replace(/[*\n]/g, '').trim();
}

exports.default = (0, _createCommand2.default)({
	name: 'release',
	description: 'tag a new version to be released with a git tag',
	alias: 'r',
	args: ['<patch|docker|canary|alpha|beta|prod>'],

	options: [{ cmd: '--local', short: '-l', desc: 'prevents tag from pushing to upstream remote' }, { cmd: '--upstream', short: '-u', args: ['<name>'], desc: 'upstream remote name to push release tags, default: origin' }],

	run: function run(type) {
		if (!buildTypes[type]) {
			_logger2.default.error('build type not found [' + type + '] valid types are \'' + Object.keys(buildTypes).join('|') + '\'');
			return;
		}

		var cwd = process.cwd();
		var pkgInfo = require(_path2.default.join(cwd + '/package.json'));
		var version = pkgInfo.version;
		var promise = _rsvp2.default.resolve({ newver: version, oldver: version });
		if (type === 'docker' || type === 'canary' || type === 'alpha' || type === 'beta') {
			promise = getNextVersion(version);
		} else if (type === 'prod' || type === 'production') {
			type === 'prod';
			//promise = RSVP.resolve({ newver: version, oldver: version });
		}

		var remote = 'origin';
		if (this.p.upstream) {
			remote = this.p.upstream;
		}

		promise.then(function (vers) {
			(0, _cmd2.default)(buildTypes[type](vers.newver)).then(function (ver) {
				ver = normailzeResponse(ver);
				(0, _cmd2.default)('git branch', { hidecmd: true }).then(function (branch) {
					branch = normailzeResponse(branch);
					(0, _cmd2.default)('git push ' + remote + ' ' + branch).then(function () {
						(0, _cmd2.default)('git push ' + remote + ' --tags').then(function () {
							_logger2.default.info(ver + ' released to remote ' + remote + '.');
						});
					});
				});
			});
		});
	}
});

},{"/Sources/@busy-web/cli/src/utils/cmd":13,"/Sources/@busy-web/cli/src/utils/create-command":14,"/Sources/@busy-web/cli/src/utils/logger":16,"path":undefined,"rsvp":undefined}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _createCommand = require('/Sources/@busy-web/cli/src/utils/create-command');

var _createCommand2 = _interopRequireDefault(_createCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import RSVP from 'rsvp';
//import cmd from '/Sources/@busy-web/cli/src/utils/cmd';
//import logger from '/Sources/@busy-web/cli/src/utils/logger';

/**
 * @module Commands
 * 
 */
exports.default = (0, _createCommand2.default)({
	name: 'template',
	description: 'creates a new template file',
	alias: 't',
	args: ['<type>', '<name>'],

	options: [{ cmd: '--delete', short: '-d', desc: 'deletes a template file' }],

	run: function run(type, name) {
		var cwd = process.cwd();
		var file = _path2.default.join(cwd, 'templates', type);
		return (0, _resolve2.default)(file, function (err, res) {
			if (err) {
				throw new Error(err);
			}
			var meta = require(res);
			_fs2.default.open(_path2.default.join(file, 'file.js'), 'r+', function (err, fd) {
				console.log('resolve', name, meta, fd);
			});
		});
	}
});

},{"/Sources/@busy-web/cli/src/utils/create-command":14,"fs":undefined,"path":undefined,"resolve":undefined}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = header;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _logger = require('/Sources/@busy-web/cli/src/utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function header() {
	_logger2.default.write(_colors2.default.yellow(" ______  _     _ _______ __   __ _  _  _ _______ ______ "));
	_logger2.default.write(_colors2.default.yellow(" |_____] |     | |______   \\_/   |  |  | |______ |_____]"));
	_logger2.default.write(_colors2.default.yellow(" |_____] |_____| ______|    |    |__|__| |______ |_____]"));
}

},{"/Sources/@busy-web/cli/src/utils/logger":16,"colors":undefined}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = help;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _logger = require('/Sources/@busy-web/cli/src/utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function help() {
	var program = process.__busyweb.program;


	program.help(function () {
		var help = _colors2.default.white.italic("  Usage: \n");
		help += _colors2.default.white.dim("    busyweb <command> [options]\n");
		help += "\n";
		help += _colors2.default.white.italic("  Example:\n");
		help += _colors2.default.white.dim("    busyweb help => print usage information\n");
		help += "\n";
		help += _colors2.default.white.italic("  Commands:\n");

		program.commands.forEach(function (cmd) {
			help += cmd.helpInfo();
		});

		_logger2.default.write(help);
		return '';
	});
}

},{"/Sources/@busy-web/cli/src/utils/logger":16,"colors":undefined}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = version;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _logger = require('/Sources/@busy-web/cli/src/utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version() {
	_logger2.default.write(_colors2.default.white.dim.italic(" version: " + process.__busyweb.package.version), "\n");
}

},{"/Sources/@busy-web/cli/src/utils/logger":16,"colors":undefined}],10:[function(require,module,exports){
'use strict';

var _application = require('/Sources/@busy-web/cli/src/lib/application');

var _application2 = _interopRequireDefault(_application);

var _header = require('/Sources/@busy-web/cli/src/helpers/header');

var _header2 = _interopRequireDefault(_header);

var _version = require('/Sources/@busy-web/cli/src/helpers/version');

var _version2 = _interopRequireDefault(_version);

var _ember = require('/Sources/@busy-web/cli/src/utils/ember');

var _help = require('/Sources/@busy-web/cli/src/helpers/help');

var _help2 = _interopRequireDefault(_help);

var _manifest = require('/Sources/@busy-web/cli/src/manifest');

var _manifest2 = _interopRequireDefault(_manifest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// get application namespace
/**
 * Application entry point for busyweb cli
 *
 */
var app = (0, _application2.default)();

// add busyweb namespace to process;
process.__busyweb = app;

(0, _header2.default)();
(0, _version2.default)();
(0, _manifest2.default)();

var hasArgs = false;
var args = process.argv.slice(2);
app.program.commands.forEach(function (cmd) {
	if (args[0] === cmd._name) {
		hasArgs = true;
		return;
	}
});

if (!hasArgs) {
	// TODO:
	// add logic here to add a throughput channel for ember-cli commands to be ran.
	//
	//if (isEmberCli()) {
	//	global.console.log('ember cli project');
	//} else {
	//	global.console.log('not an ember cli project');
	//}
	(0, _help2.default)();
}

// parse args
app.program.parse(process.argv);

},{"/Sources/@busy-web/cli/src/helpers/header":7,"/Sources/@busy-web/cli/src/helpers/help":8,"/Sources/@busy-web/cli/src/helpers/version":9,"/Sources/@busy-web/cli/src/lib/application":11,"/Sources/@busy-web/cli/src/manifest":12,"/Sources/@busy-web/cli/src/utils/ember":15}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = application;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _package = require('/Sources/@busy-web/cli/package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @modules Lib
 *
 */
function application() {

	/**
  * application namespace
  */
	var busyweb = {
		title: 'busyweb',
		description: 'web dev cli tool for node and ember-cli',
		usage: 'busyweb <command> [options]',

		debug: false,

		package: _package2.default,

		// program instance
		program: _commander2.default
	};

	// set program app info
	_commander2.default.name(busyweb.title);
	_commander2.default.description(busyweb.description);
	_commander2.default.usage(busyweb.usage);

	return busyweb;
}

},{"/Sources/@busy-web/cli/package.json":1,"commander":undefined}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = init;

var _deploy = require('/Sources/@busy-web/cli/src/commands/deploy');

var _deploy2 = _interopRequireDefault(_deploy);

var _ember = require('/Sources/@busy-web/cli/src/commands/ember');

var _ember2 = _interopRequireDefault(_ember);

var _local = require('/Sources/@busy-web/cli/src/commands/local');

var _local2 = _interopRequireDefault(_local);

var _release = require('/Sources/@busy-web/cli/src/commands/release');

var _release2 = _interopRequireDefault(_release);

var _template = require('/Sources/@busy-web/cli/src/commands/template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var COMMANDS = [_deploy2.default, _ember2.default, _local2.default, _release2.default, _template2.default];

function init() {
	return COMMANDS.map(function (Command) {
		return new Command(process.__busyweb.program);
	});
}

},{"/Sources/@busy-web/cli/src/commands/deploy":2,"/Sources/@busy-web/cli/src/commands/ember":3,"/Sources/@busy-web/cli/src/commands/local":4,"/Sources/@busy-web/cli/src/commands/release":5,"/Sources/@busy-web/cli/src/commands/template":6}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (arg) {
	var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	if (!opts.hidecmd) {
		_logger2.default.write(_colors2.default.green('=> ') + _colors2.default.blue(arg));
	}

	var spinner = (0, _ora2.default)('running', { color: 'blue' });
	spinner.start();
	return new _rsvp2.default.Promise(function (resolve) {
		var proc = (0, _child_process.exec)(arg, function (err, stdout, stderr) {
			spinner.stop();
			if (err) {
				if (!opts.ignoreError) {
					throw new Error(stderr);
				} else if (process.debug) {
					_logger2.default.err(err, stdout);
				}
			} else {
				resolve(stdout);
			}
		});

		if (opts.verbose) {
			proc.stdout.on('data', function (data) {
				_logger2.default.print(data);
			});
		}
	});
};

var _child_process = require('child_process');

var _rsvp = require('rsvp');

var _rsvp2 = _interopRequireDefault(_rsvp);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _logger = require('/Sources/@busy-web/cli/src/utils/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"/Sources/@busy-web/cli/src/utils/logger":16,"child_process":undefined,"colors":undefined,"ora":undefined,"rsvp":undefined}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createCommand;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _types = require('/Sources/@busy-web/cli/src/utils/types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseOption(opt) {
	var cmd = opt.cmd,
	    short = opt.short,
	    desc = opt.desc,
	    args = opt.args,
	    type = opt.type;

	if (!/^--/.test(cmd)) {
		cmd = '--' + cmd;
	}

	if (!/^-/.test(short)) {
		short = '-' + short;
	}

	args = args || [];
	var name = (short + ', ' + cmd + ' ' + args.join(' ')).trim();
	return { name: name, desc: desc, type: type };
}

function createCommand(opts) {
	(0, _types.assert)("createCommand takes and object <options> as a required argument", (0, _types.isDefined)(opts) && (typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) === 'object');
	(0, _types.assert)("name must exist. `opts.name = 'command name';`", (0, _types.isDefined)(opts.name));
	(0, _types.assert)("args must exist as a descriptor for the type of allowed arguments. `opts.args: ['<arg1>', '<arg2>', '[options]']", (0, _types.isArray)(opts.args));
	(0, _types.assert)("description must exist. `opts.description = 'description';`", (0, _types.isDefined)(opts.description));
	(0, _types.assert)("options must exist. `opts.options [ { cmd: '--dostuff', short: '-d', desc: 'It does something', args: [], type: typeFunc(){} } ]", (0, _types.isDefined)(opts.options));

	var run = function run() {};
	var prog = void 0;

	return function Command(program) {
		var _this = this;

		if (opts.run) {
			run = opts.run;
		}

		var cmd = (opts.name + ' ' + opts.args.join(' ')).trim();
		prog = program.command(cmd);
		prog.description(opts.description);

		opts.options.forEach(function (opt) {
			var _parseOption = parseOption(opt),
			    name = _parseOption.name,
			    desc = _parseOption.desc,
			    type = _parseOption.type;

			prog.option(name, desc, type);
		});

		prog.helpInfo = function () {
			var help = _colors2.default.blue('    ' + opts.name + ' ' + _colors2.default.italic(opts.args.join(' ')) + "\n");

			if (opts.description && opts.description.length) {
				help += '      ' + _colors2.default.white.dim(opts.description) + "\n";
			}

			if (opts.alias && opts.alias.length) {
				help += _colors2.default.blue(_colors2.default.yellow.italic('      Alias: ' + opts.alias)) + "\n";
			}

			help += _colors2.default.yellow.italic('      Options:') + "\n";
			opts.options.forEach(function (opt) {
				var _parseOption2 = parseOption(opt),
				    name = _parseOption2.name,
				    desc = _parseOption2.desc;

				if (desc && desc.length) {
					desc = ' ' + _colors2.default.white.dim(desc);
				} else {
					desc = '';
				}

				help += '        ' + _colors2.default.green(name) + desc + "\n";
			});
			help += "\n";
			return help;
		};

		this.p = prog;
		prog.action(function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return run && run.apply(_this, args);
		});
	};
}

},{"/Sources/@busy-web/cli/src/utils/types":17,"colors":undefined}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEmberCli = isEmberCli;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import cmd from '/Sources/@busy-web/cli/src/utils/cmd';

/***/

/**
 *
 */
function isEmberCli() {
  var dirname = process.cwd();
  var pkg = require(_path2.default.join(dirname, 'package.json'));
  var version = pkg.devDependencies['ember-cli'];
  return typeof version === 'string' && version.length;
} /**
   * @modules utils
   * 
   */

},{"path":undefined}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringify(args) {
	var str = [];
	args.forEach(function (a) {
		if (a === undefined) {
			a = 'undefined';
		} else if (a === null) {
			a = 'null';
		}

		if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || Array.isArray(a)) {
			a = JSON.stringify(a);
		}
		str.push(a);
	});
	return str.join(' ');
}

exports.default = {
	write: function write() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		console.log.apply(console, args); // eslint-disable-line no-console
	},
	print: function print() {
		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		this.write(_colors2.default.cyan(stringify(args)));
	},
	log: function log() {
		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		this.write(_colors2.default.grey(stringify(args)));
	},
	info: function info() {
		for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
			args[_key4] = arguments[_key4];
		}

		this.write("\n", _colors2.default.green(stringify(args)));
	},
	warn: function warn() {
		for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
			args[_key5] = arguments[_key5];
		}

		this.write("\n", _colors2.default.yellow(stringify(args)));
	},
	error: function error() {
		for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
			args[_key6] = arguments[_key6];
		}

		args.unshift("ERROR: ");
		this.write("\n", _colors2.default.red(stringify(args)));
	}
};

},{"colors":undefined}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.assert = assert;
exports.isDefined = isDefined;
exports.isArray = isArray;
function assert(msg, test) {
	if (!test) {
		throw new Error(msg);
	}
}

function isDefined(value) {
	return value !== undefined && value !== null;
}

function isArray(value) {
	return isDefined(value) && Array.isArray(value);
}

},{}]},{},[10]);
