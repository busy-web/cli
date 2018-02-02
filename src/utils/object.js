/**
 * @module Utils
 *
 */
const { splitFirst } = loader('utils/string');
const { isDefined, isEmpty, assert } = loader('utils/types');

/**
 * object getter for finding nested properties
 *
 * @public
 * @method get
 * @params target {object}
 * @params key {string}
 * @return {mixed}
 */
function get(target, key) {
	assert("get(target, key) requires an object to be passed in for arg1", isDefined(target));
	assert("get(target, key) requires a string to be passed in for arg2", !isEmpty(key));

	let [ first, rest ] = splitFirst(key, '.');
	let value = target[first];
	if (!isDefined(value) || isEmpty(rest)) { 
		return value;
	}
	return get(value, rest);
}

/**
 * object setter for setting nested properties
 *
 * @public
 * @method set
 * @params target {object}
 * @params key {string}
 * @params value {mixed}
 * @return {void}
 */
function set(target, key, value) {
	assert("set(target, key, value) requires an object to be passed in for arg1", isDefined(target));
	assert("set(target, key, value) requires a string to be passed in for arg2", !isEmpty(key));

	let [ first, rest ] = splitFirst(key, '.');
	if (isEmpty(rest)) { 
		target[key] = value;
	} else {
		let nTarget = get(target, first);
		assert(`set(target, key, value): cannot set ${first} of ${typeof nTarget}`, isDefined(nTarget) && typeof nTarget === 'object');
		
		set(nTarget, rest, value);
	}
}

module.exports = { get, set };
