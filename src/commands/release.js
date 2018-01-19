/**
 * @module Commands
 *
 */
const path = require('path');
const createCommand = loader('utils/create-command');
const cmd = loader('utils/cmd');
const logger = loader('utils/logger');


	
function buildType(release, version) {
	return `npm version ${version}-canary.0`;
}

const buildTypes = {
	docker(version) { return buildType('dev', version); },
	canary(version) { return buildType('canary', version); },
	alpha(version) { return buildType('canary', version); },
	beta(version) { return buildType('canary', version); },
	prod(version) { return `npm version ${version}`; },
	patch(version) {
		if (/-/.test(version)) {
			return 'npm version prerelease';
		} else {
			return 'npm version patch';
		}
	}
};

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
		cmd(`npm version --no-git-tag-version patch`).then(newver => {
			newver = newver.replace(/\n/g, '');
			cmd(`npm version --no-git-tag-version ${version}`).then(oldver => {
				oldver = oldver.replace(/\n/g, '');

				let arg = buildTypes[type](newver);
				console.log('command', arg);
				cmd(arg).then(ver => {
					console.log('finished version: ', ver);
				});
			});
		});
	}
});
