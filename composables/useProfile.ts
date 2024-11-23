type Profile = {
	userId: string;
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
			const supabase = useSupabaseClient<Database>();

			try {
				const response = await supabase
					.from('profiles')
					.select(
						`user_id,
						username,
						website,
						credits_added,
						credits_used,
						recruits,
						subscriptions,
						first_vote,
						choices!choices_user_id_fkey(id),
						votes(choice_id)
					`
					)
					.eq('user_id', user.value.id)
					.single();

				if (response.error) throw response.error;

				const earnedCredits = response.data.recruits?.length ?? 0;

				const creditBalance =
					response.data.credits_added +
					earnedCredits -
					(response.data.credits_used ?? 0);

				profile.value = {
					userId: response.data.user_id,
					username: response.data.username ?? '',
					credits: creditBalance,
					creditsUsed: response.data.credits_used ?? 0,
					recruits: response.data.recruits ?? [],
					website: response.data.website ?? '',
					subscriptions: response.data.subscriptions ?? [],
					firstVote: response.data.first_vote ?? 0,
					votes: response.data.votes,
					choices: response.data.choices,
				};
			} catch (error: unknown) {
				console.error((error as Error)?.message);
			}
		}
	}

	return {
		profile,
		getProfile,
	};
}
