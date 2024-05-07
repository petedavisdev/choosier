export function addDaysToISODate(days: number, date?: string) {
	const newDate = date ? new Date(date) : new Date();
	newDate.setDate(newDate.getDate() + days);
	return newDate.toISOString();
}
