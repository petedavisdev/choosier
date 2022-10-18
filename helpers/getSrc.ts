export function getSrc(image: string): string {
	let src = image;

	if (image.includes('drive.google.com/file/')) {
		const id = image.split('/').find((part) => part.length > 30);
		src = 'https://drive.google.com/uc?export=view&id=' + id;
	}

	if (image.includes('res.cloudinary.com/')) {
		const regex = /\/v[0-9]{8,}/g;
		image.replace(regex, (match) => 'c_limit,h_800,w_800' + match);
	}

	return src;
}
