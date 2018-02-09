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

/**
 * check to see if the version fits the valid standards
 *
 */
function isValidTag(type) {
	return /^v?[0-9]+\.[0-9]+\.[0-9]+[\s\S]*$/.test(type);
}

/**
 * trim any extra space and lines off the version
 * returned from the npm version cmd
 *
 */
function normailzeResponse(str) {
	return str.replace(/[*\n]/g, '').trim();
}

/**
 * normalize the build type string
 *
 */
function normalizeType(type) {
	if (type === 'production') {
		type === 'prod';
	} else if (type === 'development' || type === 'docker') {
		type === 'dev';
	}
	return type;
}

/**
 * save the new version to the public/version.json file
 * if it exists
 *
 */
function savePackageInfo(version) {
	version = version.slice(1);
	return read('public/version.json').then(data => {
		let dout = JSON.parse(data);
		dout.version = version;
		return write('public/version.json', JSON.stringify(dout));
	}).catch(() => RSVP.resolve());
}

/**
 * increment the current version to get
 * the next version based on the build type
 *
 */
function getNextVersion(build, version) {
	let [ baseVer, typeVer ] = version.split('-');
	if (build === 'prerelease') {
		let vers = typeVer.split('.');
		vers[1] = parseInt(vers[1]) + 1;
		typeVer = vers.join('.');
	} else {
		let vers = baseVer.split('.');
		if (build === 'major') {
			baseVer = [ (parseInt(vers[0]) + 1), 0, 0 ].join('.');
		} else if (build === 'minor') {
			baseVer = [ vers[0], (parseInt(vers[1]) + 1), 0 ].join('.');
		} else {
			baseVer = [ vers[0], vers[1], (parseInt(vers[2]) + 1) ].join('.');
		}
	}
	return [ baseVer, typeVer ].join('-');
}

/**
 * build a version update call npm call
 *
 * this call differs from the regular npm version call, it follows the following rules:
 *	- major: 
 *			creates a new major version with prerelease dev									--- 0.0.1						=>	1.0.0-dev.0
 *	
 *	- minor: 
 *			creates a new minor version with prerelease dev									--- 0.0.1						=>	0.1.0-dev.0
 *	
 *	- patch: 
 *			creates a new patch version when version is not in prerelease		--- 0.0.1						=>	0.0.2
 *			or increments the prerelease version														--- 0.0.1-dev.0			=>	0.0.1-dev.1
 *	
 *	- prerelease: 
 *			creates a new prerelease version																--- 0.0.1-dev.0			=>	0.0.1-dev.1
 *
 *	- <types>: 
 *			create a type specific prerelease																--- 0.0.1						=>	0.0.1.<type>.0
 *			change a type specific prerelease to another prerelease					--- 0.0.1.dev.0			=>	0.0.1.<type>.0
 *			increments a type specific prerelease														--- 0.0.1.<type>.0	=>	0.0.1.<type>.1
 *
 * @private
 * @method getAction
 * @param type {string} the version comand action
 * @param version {string} the current version of the cwd project
 * @return {string} npm version command to run.
 */
function getAction(type, version) {
	if (isValidTag(type)) {
		return type;
	} else {
		const isPreTag = /-/.test(version);
		if (type === 'major' || type === 'minor' || type === 'patch' || type === 'prerelease') { // block major and minor calls
			if (!isPreTag && type === 'patch') { 
			// normal patch version call
				return 'patch';
			} else if (isPreTag && type === 'prerelease') { 
				// normal prerelease version call
				return 'prerelease';
			} else {
				// prevent patch calls when in prerelease mode
				if (type === 'patch') { 
					type === 'prerelease'; 
				}

				let ver = getNextVersion(type, version);
				let [ baseVer ] = ver.split('-');
				// create new version command from version
				return `${baseVer}-dev.0`;
			}
		} else {
			// split version into a base version and a type version
			let [ baseVer, typeVer ] = version.split('-');
			if (type === 'prod') {  
				// production version tags
				if (isEmpty(typeVer)) { 
					// if there is no type version then the format is correct and its just a patch call
					return 'patch';
				} else { 
					// remove the type version info and create a tag with the base version info
					return baseVer;
				}
			} else {
				let typeRegex = new RegExp(type);
				if (!typeRegex.test(typeVer)) {
					// craete version type
					return `${baseVer}-${type}.0`;
				} else {
					// increment prerelease version
					return 'prerelease';
				}
			}
		}
	}
}

function getRemote() {
	let remote = false;
	if (this.program.tag) { 
		// get tag flag
		remote = typeof this.program.tag === 'string' ? this.program.tag : 'origin';
	} else if (this.program.push) { 
		// get push flag
		remote = typeof this.program.push === 'string' ? this.program.push : 'origin';
	}
	return remote;
}

function tagVersion(remote, version) {
	if (this.program.noCommit || !this.program.tag) {
		return RSVP.resolve(`Skipping tag`);
	}
	// create and push the new tag
	return cmd(`git tag -a ${version} -m "Release Version: ${version}"`, { hidecmd: true }).then(() => {
		return cmd(`git push ${remote} --tags`, { hidecmd: true }).then(() => `Tagged new release ${remote}/${version}`);
	});
}

function pushVersion(remote) {
	if (this.program.noCommit || (!this.program.tag && !this.program.push)) {
		return RSVP.resolve(`Skipping push`);
	}
	// get the branch name to push to 
	return cmd(`git branch`, { hidecmd: true }).then(branch => {
		// normalize branch name
		branch = normailzeResponse(branch);
		// push the remote tag and branch data
		return cmd(`git push ${remote} ${branch}`, { hidecmd: true }).then(() => `Pushed to ${remote}/${branch}`);
	});
}

function commitVersion(version) {
	if (this.program.noCommit) {
		return RSVP.resolve(`Skipping commit`);
	}
	// commit new version release
	return cmd(`git commit -am "Release Version: ${version}"`, { hidecmd: true }).then(() => `Created release commit`);
}


/**
 * command class
 *
 */
module.exports = createCommand({
	name: 'release',
	description: 'tag a new version to be released with a git tag. ARGS type: [ patch | docker | canary | alpha | beta | prod ]',
	alias: 'r',
	args: ['<type>'],
	
	options: [
		{ cmd: '--no-commit', desc: 'prevent version from committing and creating a new tag' },
		{ cmd: '--tag', short: '-t', args: [ '[name]' ], desc: 'tag the version and push to remote [name], default: origin' },
		{ cmd: '--push', short: '-p', args: [ '[name]' ], desc: 'push changes to remote [name], default: origin' }
	],

	run(type) {
		const cwd = process.cwd();
		const remote = getRemote.call(this);
		let pkgInfo = require(path.join(cwd + '/package.json'));
		let version = pkgInfo.version;

		// normalize type string
		type = normalizeType(type);

		// create npm version command
		let vercmd = 'npm version --no-git-tag-version ';

		// add version action
		vercmd += getAction(type, version);

		// create new npm version string
		return cmd(vercmd, { hidecmd: true }).then(ver => {
			// normalize version info
			ver = normailzeResponse(ver);
			logger.info(`Version created: ${ver}`);

			// save new version in public/version.json if project has one
			return savePackageInfo(ver).then(() => {

				// commit version info.
				return commitVersion.call(this, ver).then(commitRes => {
					logger.info(commitRes);

					// tag promise has either pushed a tag or skipped it.
					return tagVersion.call(this, remote, ver).then(tagRes => {
						logger.info(tagRes);

						// push or skip pushing to remote branch
						return pushVersion.call(this, remote).then(pushRes => {
							logger.info(pushRes);

							return RSVP.resolve(`Release version ${ver} finished!`);
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
