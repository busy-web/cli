/**
 * @module Commands
 *
 */
//const path = require('path');
const RSVP = require('rsvp');
const createCommand = loader('utils/create-command');
const cmd = loader('utils/cmd');
const logger = loader('utils/logger');
const { isEmpty } = loader('utils/types');
//const { read, write } = loader('utils/file-io');

function getSearchString(version, type) {
	let search = version;
	if (!this.program.prod) {
		search += '-';
	}

	if (!isEmpty(type)) {
		search += type;
	}
	return search;
}

function getTags(search) {
	return cmd('git fetch', { hidecmd: true }).then(() => {
		return cmd(`git tag | grep ${search}`, { hidecmd: true }).then(data => {
			data = !isEmpty(data) ? data.split('\n') : [];
			// remove empty line
			if (data[data.length-1] === '') {
				data.pop();
			}
			return data;
		}).catch(() => {
			// no tags found return empty array
			return RSVP.resolve([]);
		});
	});
}

function getLastNum(version) {
	let idx = version.lastIndexOf('.');
	return parseInt(version.substr(idx+1));
}

function versionCompare(aList, bList, idx) {
	let a = aList[idx];
	let b = bList[idx];
	if (a === undefined && b === undefined) return 0; // a and b are equal
	if (a === undefined) return 1;	// b is longer than a so it is less than a in terms of version number
	if (b === undefined) return -1; // a is longer than b so it is less than b in terms of version number

	if (!isNaN(parseInt(a))) {
		a = parseInt(a);
	}
	
	if (!isNaN(parseInt(b))) {
		b = parseInt(b);
	}
	
	if (a > b) return 1;
	if (b > a) return -1;
	
	return versionCompare(aList, bList, idx+1);
}

function sortVersionList(list) {
	return list.sort((s, e) => {
		s = s.replace(/^v/, '').replace('-', '.');
		e = e.replace(/^v/, '').replace('-', '.');
		let a = s.split('.');
		let b = e.split('.');
		return versionCompare(a, b, 0);
	});
}

function filterDeleteTags(tags, mod) {
	let lastKeeper;
	let deleteTags = tags.filter((tg, idx) => {
		if (this.program.prod && /-/.test(tg)) {
			return true;
		}

		let tgNum = getLastNum(tg);
		let shouldKeep = tgNum%mod === 0;
		if (shouldKeep) {
			lastKeeper = idx
		}
		return !shouldKeep;
	});
	
	if (lastKeeper !== tags.length-1) {
		let idx = deleteTags.indexOf(tags[lastKeeper+1]);
		deleteTags = deleteTags.slice(0, idx);
	}
	return deleteTags;
}

/**
 * command class
 *
 */
module.exports = createCommand({
	name: 'release:prune',
	description: 'Prune a release type by version',
	alias: 'r:p',
	args: ['<version>', '[type]'],
	
	options: [
		{ cmd: '--dry', desc: 'shows the tags that would be deleted but doesnt do anything' },
		{ cmd: '--all', short: '-a', desc: 'delete all tags matching the version and type' },
		{ cmd: '--mod', short: '-m', args: [ '<number>' ], desc: 'mod number to prune the tags with, default: 5' },
		{ cmd: '--remote', short: '-r', args: ['[name]'], desc: 'flag to prune remote tags for [name], default: origin' },
		{ cmd: '--prod', short: '-p', desc: 'production tags can only be deleted with --prod option applied.' }
	],

	run(version, type) {
		if (isEmpty(type) && !this.program.all && !this.program.prod) {
			return RSVP.reject("Type is required unless deleting all tags");
		}

		let mod = this.program.mod || 5;
		let search = getSearchString.call(this, version, type);
		return getTags.call(this, search).then(tags => {
			if (isEmpty(tags)) {
				return RSVP.resolve('No tags found to prune');
			}
			
			// sort tag list
			tags = sortVersionList.call(this, tags);

			let deleteTags = [];
			if (this.program.all || this.program.mod === 0) {
				// always keep latest tag when tags are not prerelease
				if (this.program.prod) {
					tags.pop();
				}
				deleteTags = tags;
			} else {
				deleteTags = filterDeleteTags.call(this, tags, mod);
			}

			if (isEmpty(deleteTags)) {
				return RSVP.resolve('No tags found to prune');
			}

			if (this.program.dry) {
				return RSVP.resolve(`Dry run, no tags have been deleted. The following would be deleted: \n    ${deleteTags.join("\n    ")}`);
			}

			const deleteTagString = deleteTags.join(' ');
			// prune local tags
			return cmd(`git tag -d ${deleteTagString}`, { hidecmd: true }).then(() => {
				logger.info('Pruned local tags');

				// prune remote tags
				let remotePromise = RSVP.resolve('Skipped prune remote tags');
				if (this.program.remote) {
					let remote = this.program.remote === true ? 'origin' : this.program.remote;
					remotePromise = cmd(`git push ${remote} --delete ${deleteTagString}`, { hidecmd: true }).then(() => `Pruned remote ${remote} tags`);
				}

				return remotePromise.then(info => {
					logger.info(info);

					return RSVP.resolve("Prune complete");
				});
			});
		});
	}
});
