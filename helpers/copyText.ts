export function copyText(text: string) {
	try {
		navigator.clipboard.writeText(text);
	} catch (error) {
		alert(error);
	}
}
