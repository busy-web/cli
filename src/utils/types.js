
export function assert(msg, test) {
	if (!test) {
		throw new Error(msg);
	}
}

export function isDefined(value) {
	return value !== undefined && value !== null;
}

export function isArray(value) {
	return isDefined(value) && Array.isArray(value);
}
