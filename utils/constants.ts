export const PATHS = {
	home: '/',
	category: '/_',
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
		description: 'Voting open to all for 24 hours',
		credits: 1,
	},
	promoted: {
		name: 'Boosted',
		description: 'Featured on the homepage for 7 days',
		credits: 5,
	},
	private: {
		name: 'Private',
		description: 'Available only via a private link for 7 days',
		credits: 5,
	},
} as const;
