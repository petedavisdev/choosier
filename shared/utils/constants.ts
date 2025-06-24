export const PATHS = {
	home: '/',
	category: '/_',
	contact: '/hello',
	new: '/!',
	results: '/=',
	success: '/$',
	user: '/@',
} as const;

export const IMAGE_LIMITS = {
	min: 2,
	max: 16,
} as const;

export const TIMES = {
	closeHours: 2,
	removeDays: 7,
	extendDays: 7,
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
		description: 'Listed on the website',
	},
	private: {
		name: 'Private',
		description: 'Only people with the link can vote',
	},
} as const;
