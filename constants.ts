export const categories = {
	art: 'Art and illustration',
	fashion: 'Fashion and costume',
	'graphic-design': 'Graphic design',
	photography: 'Photography',
	other: 'Other',
};

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
};

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
};
