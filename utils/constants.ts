export const PATHS = {
	home: '/',
	category: '/_',
	contact: '/hello',
	new: '/!',
	results: '/=',
	user: '/@',
} as const;

export const MIN_IMAGES = 2;
export const MAX_IMAGES = 16;

export const CATEGORIES = {
	art: 'Art and illustration',
	'graphic-design': 'Graphic design',
	photography: 'Photography',
	style: 'Style',
} as const;

export const VISIBILITIES = {
	public: {
		name: 'Public',
		description: 'Listed on the website',
	},
	private: {
		name: 'Private',
		description: 'Only people with the link can vote',
	},
} as const;
