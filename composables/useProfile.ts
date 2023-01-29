export function useProfile() {
	const user = useSupabaseUser();

	const userId = useState<string>('userId');
	const email = useState<string>('email');
	const username = useState<string>('username');
	const credits = useState<number>('credits');
	const website = useState<string>('website');
	const subscriptions = useState<string[]>('subscriptions');
	const votes = useState<{ choice_id: number }[]>('votes');
	const choices = useState<{ id: number }[]>('choices');

	watch(user, (newUser, oldUser) => {
		if (newUser?.id !== oldUser?.id) {
			console.log({ newUser: newUser?.id, oldUser: oldUser?.id });
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
						credits, 
						website,
						subscriptions,
						choices:choices_user_id_fkey(id),
						votes(choice_id)
					`
					)
					.eq('user_id', user.value.id)
					.single();

				if (response.error) throw response.error;

				userId.value = response.data.user_id;
				email.value = response.data.email;
				username.value = response.data.username || '';
				credits.value = response.data.credits || 0;
				website.value = response.data.website || '';
				subscriptions.value = response.data.subscriptions || [];
				votes.value = response.data.votes as { choice_id: number }[];
				choices.value = response.data.choices as { id: number }[];
			} catch (error: any) {
				console.log(error.message);
			}
		} else {
			userId.value = email.value = username.value = website.value = '';
			credits.value = 0;
			subscriptions.value = votes.value = choices.value = [];
		}
	}

	return {
		userId,
		email,
		username,
		credits,
		website,
		subscriptions,
		choices,
		votes,
		get,
	};
}
