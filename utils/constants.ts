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
		description: 'Listed on the website',
		credits: 1,
	},
	private: {
		name: 'Private',
		description: 'Only accessed via a private link',
		credits: 5,
	},
} as const;

export const DURATIONS = {
	1: {
		name: 'Quick decision',
		description: 'Voting open for 24 hours',
		credits: 0,
	},
	7: {
		name: 'Take your time',
		description: 'Voting open for 7 days',
		credits: 2,
	},
} as const;
