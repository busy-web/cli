/**
 * @module Commands
 *
 */
const path = require('path');
const RSVP = require('rsvp');
const createCommand = loader('utils/create-command');
const cmd = loader('utils/cmd');
const logger = loader('utils/logger');
const { isDefined } = loader('utils/types');
const { get } = loader('utils/object');


const PRE_DEF_BUILD = {
	patch(version) { return (/-/.test(version) ? 'npm version prerelease' : 'npm version patch'); },
	minor() { return 'npm version --no-git-tag-version minor'; },
	major() { return 'npm version --no-git-tag-version major'; },

	prod(version) { 
		let cmd = 'npm version patch';
		if (/-/.test(version)) {
			version = version.split('-')[0];
			cmd = `npm version ${version}`;
		}
		return cmd;
	}
};

function buildType(build, version) {
	// check if build is predefined
	if (isDefined(get(PRE_DEF_BUILD, build))) {
		return get(PRE_DEF_BUILD, build)(version)
	} else { // else return custom build name
		return `npm version ${version}-${build}.1`;
	}
}

function getNextVersion(version) {
	let mode = 'patch';
	if (/-/.test(version)) {
		mode = 'prerelease';
	}
	return cmd(`npm version --no-git-tag-version ${mode}`, { hidecmd: true }).then(newver => {
		newver = normailzeResponse(newver);
		newver = newver.split('-')[0];
		return cmd(`npm version --no-git-tag-version ${version}`, { hidecmd: true }).then(oldver => {
			oldver = normailzeResponse(oldver);
			return { newver, oldver };
		});
	});
}

function normailzeResponse(str) {
	return str.replace(/[*\n]/g, '').trim();
}

module.exports = createCommand({
	name: 'release',
	description: 'tag a new version to be released with a git tag. ARGS type: [ patch | docker | canary | alpha | beta | prod ]',
	alias: 'r',
	args: ['<type>'],
	
	options: [
		{ cmd: '--local', short: '-l', desc: 'prevents tag from pushing to upstream remote' },
		{ cmd: '--upstream', short: '-u', args: ['<name>'], desc: 'upstream remote name to push release tags, default: origin' }
	],
	
	run(type) {

		const cwd = process.cwd();
		let pkgInfo = require(path.join(cwd + '/package.json'));
		let version = pkgInfo.version;
		let promise = RSVP.resolve({ newver: version, oldver: version });
		if (type === 'docker' || type === 'canary' || type === 'alpha' || type === 'beta') {
			promise = getNextVersion(version);
		} else if (type === 'prod' || type === 'production') {
			type === 'prod';
			//promise = RSVP.resolve({ newver: version, oldver: version });
		}

		let remote = 'origin';
		if (this.program.upstream) {
			remote = this.program.upstream;
		}

		promise.then(vers => {
			cmd().then(ver => {
				ver = normailzeResponse(ver);
				cmd(`git branch`, { hidecmd: true }).then(branch => {
					branch = normailzeResponse(branch);
					cmd(`git push ${remote} ${branch}`).then(() => {
						cmd(`git push ${remote} --tags`).then(() => {
							logger.info(`${ver} released to remote ${remote}.`);
						});
					});
				});
			});
		});
	}
});
