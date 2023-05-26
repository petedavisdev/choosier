const RADIX = 36;

export function idToString(id: number) {
	return id.toString(RADIX);
}

export function idToNumber(shortId: string | string[]) {
	const idString = Array.isArray(shortId) ? shortId[0] : shortId;
	return parseInt(idString, RADIX);
}
