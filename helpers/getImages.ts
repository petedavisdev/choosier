import fithackerColors from '~/data/FithackerColors.json';
import peteProfilePic from '~/data/PeteProfilePic.json';

export function getImages(id: number) {
	let images: string[] = [];

	if (id === 1) images = fithackerColors;
	if (id === 2) images = peteProfilePic;

	return images;
}
