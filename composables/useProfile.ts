export function useProfile() {
	const username = useState<string>('username', () => '');
	const credits = useState<number>('credits', () => 0);

	function reset() {
		username.value = '';
		credits.value = 0;
	}

	async function get() {
		const supabase = useSupabaseClient();
		const user = useSupabaseUser();

		if (user.value) {
			try {
				const response = await supabase
					.from('profiles')
					.select(`username, credits`)
					.eq('user_id', user.value?.id)
					.single();

				if (response.error) throw response.error;

				username.value = response.data.username;
				credits.value = response.data.credits;
			} catch (error: any) {
				console.log(error.message);
			}
		} else {
			reset();
		}

		return { username, credits };
	}

	get();

	return { username, credits, get, reset };
}
