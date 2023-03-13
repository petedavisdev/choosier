export type Vote = {
	user_id: string;
	image_url: string;
	profiles: {
		username: string;
		first_vote: number;
	};
};
