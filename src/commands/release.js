/**
 * @module Commands
 *
 */
const path = require('path');
const createCommand = loader('utils/create-command');
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
	}).catch(() => this.resolve());
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

function getRemote(tag, push) {
	let remote = false;
	if (tag) { 
		// get tag flag
		remote = typeof tag === 'string' ? tag : 'origin';
	} else if (push) { 
		// get push flag
		remote = typeof push === 'string' ? push : 'origin';
	}
	return remote;
}

function tagVersion(remote, version, tag, noCommit) {
	if (noCommit || !tag) {
		return this.resolve(`Skipping tag`);
	}
	// create and push the new tag
	return this.cmd(`git tag -a ${version} -m "Release Version: ${version}"`, { hidecmd: true }).then(() => {
		return this.cmd(`git push ${remote} --tags`, { hidecmd: true })
			.then(() => `Tagged new release ${remote}/${version}`);
	});
}

function pushVersion(remote, branch, tag, push, noCommit) {
	if (noCommit || (!tag && !push)) {
		return this.resolve(`Skipping push`);
	}

	// push the remote tag and branch data
	return this.cmd(`git push ${remote} ${branch}`, { hidecmd: true })
		.then(() => `Pushed to ${remote}/${branch}`);
}

function commitVersion(version, noCommit) {
	if (noCommit) {
		return this.resolve(`Skipping commit`);
	}
	// commit new version release
	return this.cmd(`git commit -am "Release Version: ${version} [ci skip]"`, { hidecmd: true })
		.then(res => {
			this.ui.info(res);
			return `Created release commit`;
		});
}

function gitBranch(branch=false) {
	if (branch) {
		this.cmd(`git checkout ${branch}`, { hidecmd: true }).then(() => {
			return branch;
		});
	} else {
		// get the branch name to push to 
		return this.cmd(`git status`, { hidecmd: true }).then(status => {
			let [ stat ] = status.split('\n');
			let [ ,, branchName ] = stat.split(' ');
		
			// normalize branch name
			branch = normailzeResponse(branchName);
			return branch;
		});
	}
}

function release(type, tag=false, push=false, noCommit=false, branch=false) {
	const cwd = process.cwd();
	const remote = getRemote.call(this, tag, push);
	let pkgInfo = require(path.join(cwd + '/package.json'));
	let version = pkgInfo.version;

	// normalize type string
	type = normalizeType(type);

	// create npm version command
	let vercmd = 'npm version --no-git-tag-version ';

	// add version action
	vercmd += getAction(type, version);

	return gitBranch.call(this, branch).then(branchName => {
		// create new npm version string
		return this.cmd(vercmd, { hidecmd: true }).then(ver => {
			// normalize version info
			ver = normailzeResponse(ver);
			this.ui.info(`Version created: ${ver}`);

			// save new version in public/version.json if project has one
			return savePackageInfo.call(this, ver).then(() => {

				// commit version info.
				return commitVersion.call(this, ver, noCommit).then(commitRes => {
					this.ui.info(commitRes);

					// tag promise has either pushed a tag or skipped it.
					return tagVersion.call(this, remote, ver, tag, noCommit).then(tagRes => {
						this.ui.info(tagRes);

						// push or skip pushing to remote branch
						return pushVersion.call(this, remote, branchName, tag, push, noCommit).then(pushRes => {
							this.ui.info(pushRes);

							return ver; 
						});
					});
				});
			});
		});
	});
}


/**
 * command class
 *
 */
module.exports = {
	release,
	default: createCommand({
		name: 'release',
		description: 'tag a new version to be released with a git tag. ARGS type: [ patch | docker | canary | alpha | beta | prod ]',
		alias: 'r',
		args: ['<type>'],
		
		options: [
			{ cmd: '--no-commit', desc: 'prevent version from committing and creating a new tag' },
			{ cmd: '--tag', short: '-t', args: [ '[name]' ], desc: 'tag the version and push to remote [name], default: origin' },
			{ cmd: '--push', short: '-p', args: [ '[name]' ], desc: 'push changes to remote [name], default: origin' },
			{ cmd: '--branch', short: '-b', args: [ '[name]' ], desc: 'override the current branch, default: current branch' }
		],

		run(type) {
			return release.call(this, type, this.program.tag, this.program.push, this.program.noCommit, this.program.branch).then(ver => {
				return this.resolve(`Release version ${ver} finished!`);
			});
		}
	})
};

