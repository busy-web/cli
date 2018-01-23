
function assert(msg, test) {
	if (!test) {
		throw new Error(msg);
	}
}

function isDefined(value) {
	return value !== undefined && value !== null;
}

function isArray(value) {
	return isDefined(value) && Array.isArray(value);
}

module.exports = {
	assert,
	isDefined,
	isArray
};
