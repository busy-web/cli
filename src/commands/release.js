/**
 * @module Commands
 *
 */
const path = require('path');
const RSVP = require('rsvp');
const createCommand = loader('utils/create-command');
const cmd = loader('utils/cmd');
const logger = loader('utils/logger');
const { isEmpty } = loader('utils/types');
const { read, write } = loader('utils/file-io');
//const { get } = loader('utils/object');

function isValidType(type) {
	return /^(patch|prerelease|v?[0-9]+\.[0-9]+\.[0-9]+[\s\S]*)$/.test(type);
}

function versionCommand(program, type) {
	if (!isValidType(type)) {
		throw new Error(`type is not valid [ ${type} ]`);
	}

	let cmd = 'npm version';
	if (program.noTag) {
		cmd += ' --no-git-tag-version';
	}
	return cmd + ' ' + type;
}

function buildVersionCmd(program, type, version) {
	logger.log('version', version);
	if (type === 'patch' && /-/.test(version)) {
		type === 'prerelease';
	}

	if (isValidType(type)) {
		return versionCommand(program, type);
	} else {
		if (type === 'minor' || type === 'major') {
			let ver = getNextVersion(type, version);
			let [ baseVer ] = ver.split('-');
			return versionCommand(program, `${baseVer}-dev.0`);
		} else {
			// split version into a base version and a type version
			let [ baseVer, typeVer ] = version.split('-');
			if (type === 'prod') {  // production version tags
				if (isEmpty(typeVer)) { // if there is no type version then the format is correct and its just a patch call
					return versionCommand(program, 'patch');
				} else { // remove the type version info and create a tag with the base version info
					return versionCommand(program, baseVer);
				}
			} else {
				let typeRegex = new RegExp(type);
				console.log('type', type, typeRegex, typeVer, typeRegex.test(typeVer));
				if (!typeRegex.test(typeVer)) {
					return versionCommand(program, `${baseVer}-${type}.0`);
				} else {
					return versionCommand(program, 'prerelease');
				}
			}
		}
	}
}

function normailzeResponse(str) {
	return str.replace(/[*\n]/g, '').trim();
}

function normalizeType(type) {
	if (type === 'production') {
		type === 'prod';
	} else if (type === 'development' || type === 'docker') {
		type === 'dev';
	}
	return type;
}

function savePackageInfo(version) {
	version = version.slice(1);
	return read('public/version.json').then(data => {
		let dout = JSON.parse(data);
		dout.version = version;
		return write('public/version.json', JSON.stringify(dout));
	}).catch(() => RSVP.resolve());
}

function getNextVersion(build, version) {
	let [ baseVer, typeVer ] = version.split('-');
	if (build === 'prerelease') {
		let vers = typeVer.split('.');
		vers[1] = parseInt(vers[1]) + 1;
		typeVer = vers.join('.');
	} else {
		let vers = baseVer.split('.');
		let idx = (build === 'major' ? 0 : (build === 'minor' ? 1 : 2));
		vers[idx] = parseInt(vers[idx]) + 1;
		baseVer = vers.join('.');
	}
	return [ baseVer, typeVer ].join('-');
}


module.exports = createCommand({
	name: 'release',
	description: 'tag a new version to be released with a git tag. ARGS type: [ patch | docker | canary | alpha | beta | prod ]',
	alias: 'r',
	args: ['<type>'],
	
	options: [
		{ cmd: '--no-tag', desc: 'prevent version from creating git tag' },
		{ cmd: '--local', short: '-l', desc: 'prevents tag from pushing to upstream remote' },
		{ cmd: '--upstream', short: '-u', args: ['<name>'], desc: 'upstream remote name to push release tags, default: origin' }
	],
	
	run(type) {
		const cwd = process.cwd();
		let pkgInfo = require(path.join(cwd + '/package.json'));
		let version = pkgInfo.version;
		
		// normalize type string
		type = normalizeType(type);

		// create version command to run.
		const vercmd = buildVersionCmd(this.program, type, version);

		// create new npm version string
		return cmd(vercmd).then(ver => {
			// normalize version info
			ver = normailzeResponse(ver);

			console.log('ver', ver);
			return savePackageInfo(ver).then(() => {
				// return here if local param was passed.
				if (this.program.local) {
					return RSVP.resolve(`Release version: ${ver} has been created, but has not been pushed to any remote.`);
				}

				return cmd(`git branch`, { hidecmd: true }).then(branch => {
					// normalize branch name
					branch = normailzeResponse(branch);

					// get remote name
					let remote = 'origin';
					if (this.program.upstream) {
						remote = this.program.upstream;
					}

					// push the remote tag and branch data
					return cmd(`git push ${remote} ${branch}`).then(() => {
						return cmd(`git push ${remote} --tags`).then(() => {
							return RSVP.resolve(`Release version: ${ver} has been created and pushed to remote ${remote}.`);
						});
					});
				});
			});
		}).catch(err => {
			if (process.__busyweb.debug) {
				logger.error(err);
			}
			return RSVP.reject(`Run cmd: ${vercmd} failed to execute.`);
		});
	}
});
