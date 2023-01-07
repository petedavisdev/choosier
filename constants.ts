export const imageLimits = {
	6: 0,
	10: 1,
} as const;

export const categories = {
	art: 'Art and illustration',
	'graphic-design': 'Graphic design',
	photography: 'Photography',
	style: 'Style',
} as const;

export const visibility = {
	public: {
		name: 'Public',
		description: '',
		credits: 0,
	},
	promoted: {
		name: 'Promoted',
		description: 'Choosier homepage + Instagram',
		credits: 1,
	},
	private: {
		name: 'Private',
		description: 'Coming soon...',
		credits: 1,
	},
} as const;

export const duration = {
	1: {
		name: 'Quick decision',
		description: 'Voting open for 24 hours',
		credits: 0,
	},
	7: {
		name: 'Take your time',
		description: 'Voting open for 7 days',
		credits: 1,
	},
} as const;
