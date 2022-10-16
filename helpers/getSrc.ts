export function getSrc(image: string): string {
	let src = image;

	if (image.includes('drive.google.com/file/')) {
		const id = image.split('/').find((part) => part.length > 30);
		src = 'https://drive.google.com/uc?export=view&id=' + id;
	}

	return src;
}
