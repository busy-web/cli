/**
 * @module Commands
 *
 */
const path = require('path');
const RSVP = require('rsvp');
const createCommand = loader('utils/create-command');
const cmd = loader('utils/cmd');
const logger = loader('utils/logger');


	
function buildType(release, version) {
	return `npm version ${version}-${release}.0`;
}

const buildTypes = {
	docker(version) { return buildType('dev', version); },
	canary(version) { return buildType('canary', version); },
	alpha(version) { return buildType('alpha', version); },
	beta(version) { return buildType('beta', version); },
	prod(version) { return `npm version ${version}`; },
	patch(version) {
		if (/-/.test(version)) {
			return 'npm version prerelease';
		} else {
			return 'npm version patch';
		}
	}
};

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
	description: 'tag a new version to be released with a git tag',
	alias: 'r',
	args: ['<patch|docker|canary|alpha|beta|prod>'],
	
	options: [
		{ cmd: '--local', short: '-l', desc: 'prevents tag from pushing to upstream remote' },
		{ cmd: '--upstream', short: '-u', args: ['<name>'], desc: 'upstream remote name to push release tags, default: origin' }
	],
	
	run(type) {
		if (!buildTypes[type]) {
			logger.error(`build type not found [${type}] valid types are '${Object.keys(buildTypes).join('|')}'`);
			return;
		}

		const cwd = process.cwd();
		let pkgInfo = require(path.join(cwd + '/package.json'));
		let version = pkgInfo.version;
		let promise = RSVP.resolve({ newver: version, oldver: version });
		if (type === 'docker' || type === 'canary' || type === 'alpha' || type === 'beta') {
			promise = getNextVersion(version);
		}

		let remote = 'origin';
		if (this.p.upstream) {
			remote = this.p.upstream;
		}

		promise.then(vers => {
			let arg = buildTypes[type](vers.newver);
			logger.info(arg);
			cmd(arg).then(ver => {
				cmd(`git branch`, { hidecmd: true }).then(branch => {
					branch = normailzeResponse(branch);
					cmd(`git push ${remote} ${branch}`).then(() => {
						cmd(`git push ${remote} --tags`).then(() => {
							logger.info(`${ver} released to ${remote}/${branch}!`);
						});
					});
				});
			});
		});
	}
});
