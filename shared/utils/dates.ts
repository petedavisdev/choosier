export function addDaysToISODate(days: number, date?: string) {
	const newDate = date ? new Date(date) : new Date();
	newDate.setDate(newDate.getDate() + days);
	return newDate.toISOString();
}

export function longDateText(dateValue: string | Date | undefined) {
	if (dateValue === undefined) return '';

	const date = new Date(dateValue);

	return date.toLocaleString(undefined, {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		hour: 'numeric',
		minute: 'numeric',
	});
}

export function shortDateText(dateValue: string | Date | undefined) {
	if (dateValue === undefined) return '';

	const date = new Date(dateValue);

	return date.toLocaleString(undefined, {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});
}
