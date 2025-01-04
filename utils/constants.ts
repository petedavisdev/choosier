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
		name: 'Basic',
		description: '24-hour public poll',
		price: 'FREE',
	},
	promoted: {
		name: 'Boosted',
		description: '7-day poll featured on the homepage',
		price: '$9',
	},
	private: {
		name: 'Private',
		description: '7-day poll you can share by secret link',
		price: '$3',
	},
} as const;
