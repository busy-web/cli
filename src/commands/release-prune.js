/**
 * @module Commands
 *
 */
const createCommand = loader('utils/create-command');
const { versionCompare, isEmpty } = loader('utils/types');

function getSearchString(version, type, prod) {
	let search = version;
	if (!prod) {
		search += '-';
	}

	if (!isEmpty(type)) {
		search += type;
	}
	return search;
}

function getTags(search) {
	return this.cmd('git fetch', { hidecmd: true }).then(() => {
		return this.cmd(`git tag | grep ${search}`, { hidecmd: true }).then(data => {
			data = !isEmpty(data) ? data.split('\n') : [];
			// remove empty line
			if (data[data.length-1] === '') {
				data.pop();
			}
			return data;
		}).catch(() => {
			// no tags found return empty array
			return this.resolve([]);
		});
	});
}

function getLastNum(version) {
	let idx = version.lastIndexOf('.');
	return parseInt(version.substr(idx+1));
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

function filterDeleteTags(tags, mod, prod) {
	let lastKeeper;
	let deleteTags = tags.filter((tg, idx) => {
		if (prod && /-/.test(tg)) {
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

function prune(version, type, mod=5, remote=false, all=false, prod=false, dry=false) {
	mod = mod || 5;

	if (isEmpty(type) && !all && !prod) {
		return this.reject("Type is required unless deleting all tags");
	}

	let search = getSearchString.call(this, version, type, prod);
	return getTags.call(this, search).then(tags => {
		if (isEmpty(tags)) {
			return this.resolve('No tags found to prune');
		}
		
		// sort tag list
		tags = sortVersionList.call(this, tags);

		let deleteTags = [];
		if (all || mod === 0) {
			// always keep latest tag when tags are not prerelease
			if (prod) {
				tags.pop();
			}
			deleteTags = tags;
		} else {
			deleteTags = filterDeleteTags.call(this, tags, mod, prod);
		}

		if (isEmpty(deleteTags)) {
			return this.resolve('No tags found to prune');
		}

		if (dry) {
			return this.resolve(`Dry run, no tags have been deleted. The following would be deleted: \n    ${deleteTags.join("\n    ")}`);
		}

		const deleteTagString = deleteTags.join(' ');
		// prune local tags
		return this.cmd(`git tag -d ${deleteTagString}`, { hidecmd: true }).then(() => {
			this.ui.info('Pruned local tags');

			// prune remote tags
			let remotePromise = this.resolve('Skipped prune remote tags');
			if (remote) {
				let remoteStr = remote === true ? 'origin' : remote;
				remotePromise = this.cmd(`git push ${remoteStr} --delete ${deleteTagString}`, { hidecmd: true })
					.then(() => `Pruned remote ${remoteStr} tags`)
					.catch(err => this.ui.error(err));
			}

			return remotePromise.then(info => {
				this.ui.info(info);

				return this.resolve("Prune complete");
			});
		});
	});
}

/**
 * command class
 *
 */
module.exports = {
	prune, 
	default: createCommand({
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
			return prune.call(this, version, type, this.program.mod, this.program.remote, this.program.all, this.program.prod, this.program.dry);
		}
	})
};
