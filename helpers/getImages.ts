import fithackerColors from '~/data/FithackerColors.json';
import peteProfilePic from '~/data/PeteProfilePic.json';

export function getImages(id: string): string[] {
	let images;
	switch (id) {
		case '1':
			images = fithackerColors;
			break;

		case '2':
			images = peteProfilePic;
			break;

		default:
			images = [];
			break;
	}
	return images;
}
