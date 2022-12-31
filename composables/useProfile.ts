export function useProfile() {
	const username = useState<string>('username');
	const credits = useState<number>('credits');
	const website = useState<string>('website');

	function unset() {
		username.value = '';
		credits.value = 0;
		website.value = '';
	}

	async function get() {
		const supabase = useSupabaseClient();
		const user = useSupabaseUser();

		if (user.value) {
			try {
				const response = await supabase
					.from('profiles')
					.select(`username, credits, website`)
					.eq('user_id', user.value?.id)
					.single();

				if (response.error) throw response.error;

				username.value = response.data.username;
				credits.value = response.data.credits;
			} catch (error: any) {
				console.log(error.message);
			}
		} else {
			unset();
		}

		return { username, credits, website };
	}

	return { username, credits, website, get, unset };
}
