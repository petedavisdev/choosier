export const PATHS = {
	category: '/_',
	edit: '/edit-',
	results: '/results-',
	user: '/@',
} as const;

export const MIN_IMAGES = 2;

export const IMAGE_LIMITS = {
	6: 0,
	10: 2,
} as const;

export const CATEGORIES = {
	art: 'Art and illustration',
	'graphic-design': 'Graphic design',
	photography: 'Photography',
	style: 'Style',
} as const;

export const VISIBILITIES = {
	public: {
		name: 'Public',
		description: '',
		credits: 0,
	},
	promoted: {
		name: 'Promoted',
		description: 'Choosier homepage',
		credits: 2,
	},
	private: {
		name: 'Private',
		description: 'Coming soon...',
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
