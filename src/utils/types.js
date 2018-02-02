/**
 * @module Utils
 *
 */

function assert(msg, test) {
	if (!test) {
		throw new Error(msg);
	}
}

function isDefined(value) {
	return value !== undefined && value !== null;
}

function isEmpty(value) {
	return !(isDefined(value) && value.length > 0); 
}

function isArray(value) {
	return isDefined(value) && Array.isArray(value);
}

module.exports = {
	assert,
	isDefined,
	isEmpty,
	isArray
};
