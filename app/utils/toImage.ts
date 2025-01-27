import { toJpeg } from 'html-to-image';

export async function downloadImage(
	name: string,
	pixelRatio: number,
	quality: number = 1,
	element?: HTMLElement
) {
	const imageUrl = await toImage(pixelRatio, quality, element);

	if (imageUrl) {
		const link = document.createElement('a');
		link.href = imageUrl;
		link.download = `${name}.jpeg`;
		link.click();
	}
}

export async function toImage(
	pixelRatio: number,
	quality: number,
	element?: HTMLElement
) {
	if (!element) return console.error('toImage: Element is not defined');
	try {
		// Safari workaround: run toJpeg multiple times to display images within the element
		let imageUrl = await toJpeg(element, { pixelRatio, quality });
		imageUrl = await toJpeg(element, { pixelRatio, quality });
		imageUrl = await toJpeg(element, { pixelRatio, quality });
		return imageUrl;
	} catch (error) {
		console.error(error);
	}
}
