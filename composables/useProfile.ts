export function useProfile() {
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();

	const userId = useState<string | null>('userId');
	const email = useState<string | null>('email');
	const username = useState<string | null>('username');
	const credits = useState<number | null>('credits');
	const website = useState<string | null>('website');
	const loading = useState<boolean>('loading');

	watch(user, (newUser, oldUser) => {
		if (newUser?.id !== oldUser?.id) get();
	});

	async function get() {
		if (user.value?.id) {
			loading.value = true;

			try {
				const response = await supabase
					.from('profiles')
					.select(`user_id, email, username, credits, website`)
					.eq('user_id', user.value.id)
					.single();

				if (response.error) throw response.error;

				userId.value = response.data.user_id;
				email.value = response.data.email;
				username.value = response.data.username;
				credits.value = response.data.credits;
				website.value = response.data.website;
				loading.value = false;
			} catch (error: any) {
				console.log(error.message);
			} finally {
				loading.value = false;
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
		loading,
		get,
	};
}
