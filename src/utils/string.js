/**
 * @module Utils
 *
 */
const { assert, isDefined } = loader('utils/types');

/**
 * split the string into 2 parts at the first search char found
 *
 * @public
 * @method splitFirst
 * @param str {string}
 * @param search {string}
 * @return {string[]}
 */
function splitFirst(str, search) {
	assert(`splitFirst(str, search) requires a string to be passed in for arg1, you passed ${typeof str}`, isDefined(str) && typeof str === 'string');
	assert(`splitFirst(str, search) requires a string to be passed in for arg2, you passed ${typeof search}`, isDefined(search) && typeof search === 'string');

	let idx = str.indexOf(search);
	if (idx === -1) { 
		return [ str, '' ]; 
	}

  let first = str.substr(0, idx);
	let rest = str.substr(idx + 1);
	return [ first, rest ];
}

/**
 * split the string into 2 parts at the last search char found
 *
 * @public
 * @method splitLast
 * @param str {string}
 * @param search {string}
 * @return {string[]}
 */
function splitLast(str, search) {
	assert(`splitLast(str, search) requires a string to be passed in for arg1, you passed ${typeof str}`, isDefined(str) && typeof str === 'string');
	assert(`splitLast(str, search) requires a string to be passed in for arg2, you passed ${typeof search}`, isDefined(search) && typeof search === 'string');

	let idx = str.lastIndexOf(search);
	if (idx === -1) { 
		return [ str, '' ]; 
	}

  let rest = str.substr(0, idx);
	let last = str.substr(idx + 1);
	return [ last, rest ];
}

module.exports = {
	splitFirst,
	splitLast
};
