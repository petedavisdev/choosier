type Profile = {
	userId: string;
	username: string;
	website: string;
	subscriptions?: string[];
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
						subscriptions,
						choices!choices_user_id_fkey(id),
						votes(choice_id)
					`
					)
					.eq('user_id', user.value.id)
					.single();

				if (response.error) throw response.error;

				profile.value = {
					userId: response.data.user_id,
					username: response.data.username ?? '',
					website: response.data.website ?? '',
					subscriptions: response.data.subscriptions ?? [],
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
