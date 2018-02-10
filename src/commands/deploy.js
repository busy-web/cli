/**
 * @module Commands
 * 
 */
const path = require('path');
const createCommand = loader('utils/create-command');
const { release } = loader('commands/release');
const { prune } = loader('commands/release-prune');
const { isEmpty } = loader('utils/types');

function getBuildInfo(version) {
	let vers = version.slice(1);
	let idx = vers.lastIndexOf('.');
	vers = vers.slice(0, idx);
	let [ v, b ] = vers.split('-');
	return { version: v, build: b };
}

function getRevision() {
	return this.cmd(`git log -1 --format=%H`, { hidecmd: true }).then(hash => hash.substr(0, 7));
}

module.exports = createCommand({
	name: 'deploy',
	description: 'deploy build to server.',
	alias: 'd',
	args: ['[branch]', '[tag]'],
	
	options: [
		//{ cmd: '--prod', short: '-p', desc: 'production tags can only be deleted with --prod option applied.' }
	],
	
	run(branch, tag) {
		let cwd = process.cwd();
		let pkgInfo = require(path.join(cwd + '/package.json'));
		let version = pkgInfo.version;
		
		let [ baseVer, buildVer ] = version.split('-');
		baseVer = baseVer.split('.');
		baseVer = [ baseVer[0], baseVer[1] ].join('.');

		if (!isEmpty(tag)) {
			if (/v[0-9]+\.[0-9]+\.[0-9]+$/.test(tag)) {
				this.ui.info('Preparing production deploy...');
				return getRevision.call(this).then(revision => {
					return this.cmd(`ember deploy production`).then(() => {
						return this.cmd(`ember deploy:activate --revision ${revision} production`).then(() => {
							return this.resolve('Deploy finished!');
						});
					});
				});
			} else {
				this.resolve('Not a production tag. Skipping deploy');
			}
		} else if (!isEmpty(branch)) {
			let [ build, ] = buildVer.split('.');
			if (branch === 'master') {
				build = 'canary';
			} else if (branch !== baseVer || isEmpty(buildVer)) {
				return this.resolve("Not a release branch");
			}

			return release.call(this, build, true, true, false, branch).then(res => {
				let info = getBuildInfo(res);
				return prune.call(this, info.version, info.build, 5, true).then(result => {
					this.ui.info(result);
					return getRevision.call(this).then(revision => {
						return this.cmd(`ember deploy ${info.build}`).then(() => {
							return this.cmd(`ember deploy:activate --revision ${revision} ${info.build}`).then(() => {
								return this.resolve('Deploy finished!');
							});
						});
					});
				});
			});
		} else {
			return this.reject('You must provide a tag or a branch');
		}
	}
});
