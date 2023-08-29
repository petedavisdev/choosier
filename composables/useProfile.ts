type Profile = {
	userId: string;
	email: string;
	username: string;
	website: string;
	credits: number;
	creditsUsed: number;
	recruits: string[];
	subscriptions?: string[];
	firstVote: number;
	choices: { id: number }[];
	votes: { choice_id: number }[];
};

export function useProfile() {
	const user = useSupabaseUser();
	const profile = useState<Profile | null>('profile', () => null);

	watch(user, (newUser, oldUser) => {
		if (newUser?.id !== oldUser?.id) {
			getProfile();
		}
	});

	async function getProfile() {
		profile.value = null;

		if (user.value?.id) {
			const supabase = useSupabaseClient();

			try {
				const response = await supabase
					.from('profiles')
					.select(
						`user_id,
						email,
						username,
						website,
						credits_added,
						credits_used,
						recruits,
						subscriptions,
						first_vote,
						choices:choices_user_id_fkey(id),
						votes(choice_id)
					`
					)
					.eq('user_id', user.value.id)
					.single();

				if (response.error) throw response.error;

				const earnedCredits = response.data.recruits
					? // @ts-ignore
					  (response.data.recruits?.length as number)
					: 0;

				const creditBalance =
					response.data.credits_added +
					earnedCredits -
					response.data.credits_used;

				profile.value = {
					userId: response.data.user_id,
					email: response.data.email,
					username: response.data.username || '',
					credits: creditBalance,
					creditsUsed: response.data.credits_used || 0,
					recruits: response.data.recruits || [],
					website: response.data.website || '',
					subscriptions: response.data.subscriptions || [],
					firstVote: response.data.first_vote || 0,
					votes: response.data.votes as { choice_id: number }[],
					choices: response.data.choices as { id: number }[],
				};
			} catch (error: any) {
				console.log(error.message);
			}
		}
	}

	return {
		profile,
		getProfile,
	};
}
