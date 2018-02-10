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

function versionCompare(aList, bList, idx) {
	if (aList.length > bList.length) return -1;
	if (bList.length > aList.length) return 1;

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

module.exports = {
	assert,
	isDefined,
	isEmpty,
	isArray,
	versionCompare
};
