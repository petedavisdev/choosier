export function useProfile() {
	const user = useSupabaseUser();

	const userId = useState<string>('userId');
	const email = useState<string>('email');
	const username = useState<string>('username');
	const avatar = useState<string>('avatar');
	const credits = useState<number>('credits');
	const creditsUsed = useState<number>('creditsUsed');
	const website = useState<string>('website');
	const recruits = useState<string[]>('recruits');
	const subscriptions = useState<string[]>('subscriptions');
	const firstVote = useState<number>('firstVote');
	const votes = useState<{ choice_id: number }[]>('votes');
	const choices = useState<{ id: number }[]>('choices');

	watch(user, (newUser, oldUser) => {
		if (newUser?.id !== oldUser?.id) {
			get();
		}
	});

	async function get() {
		if (user.value?.id) {
			const supabase = useSupabaseClient();

			try {
				const response = await supabase
					.from('profiles')
					.select(
						`user_id,
						email,
						username,
						avatar,
						credits,
						credits_used,
						website,
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
					response.data.credits + earnedCredits - response.data.credits_used;

				userId.value = response.data.user_id;
				email.value = response.data.email;
				username.value = response.data.username || '';
				avatar.value = response.data.avatar || '';
				credits.value = creditBalance;
				creditsUsed.value = response.data.credits_used || 0;
				website.value = response.data.website || '';
				recruits.value = response.data.recruits || [];
				subscriptions.value = response.data.subscriptions || [];
				firstVote.value = response.data.first_vote || 0;
				votes.value = response.data.votes as { choice_id: number }[];
				choices.value = response.data.choices as { id: number }[];
			} catch (error: any) {
				console.log(error.message);
			}
		} else {
			userId.value =
				email.value =
				username.value =
				avatar.value =
				website.value =
					'';
			credits.value = creditsUsed.value = firstVote.value = 0;
			recruits.value = subscriptions.value = votes.value = choices.value = [];
		}
	}

	return {
		userId,
		email,
		username,
		avatar,
		website,
		credits,
		creditsUsed,
		recruits,
		subscriptions,
		firstVote,
		choices,
		votes,
		get,
	};
}
