export function useProfile() {
	const user = useSupabaseUser();

	const userId = useState<string | null>('userId');
	const email = useState<string | null>('email');
	const username = useState<string | null>('username');
	const credits = useState<number | null>('credits');
	const website = useState<string | null>('website');
	const votes = useState<{ choice_id: number }[] | null>('votes');
	const choices = useState<{ id: number }[] | null>('choices');

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
						choices:choices_user_id_fkey(id),
						votes(choice_id)
					`
					)
					.eq('user_id', user.value.id)
					.single();

				if (response.error) throw response.error;

				userId.value = response.data.user_id;
				email.value = response.data.email;
				username.value = response.data.username;
				credits.value = response.data.credits;
				website.value = response.data.website;
				votes.value = response.data.votes as { choice_id: number }[];
				choices.value = response.data.choices as { id: number }[];
			} catch (error: any) {
				console.log(error.message);
			}
		} else {
			userId.value =
				email.value =
				username.value =
				credits.value =
				website.value =
					null;
		}
	}

	return {
		userId,
		email,
		username,
		credits,
		website,
		choices,
		votes,
		get,
	};
}
