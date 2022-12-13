export function useProfile() {
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const username = useState<string>('username', () => '');
	const credits = useState<number>('credits', () => 0);

	async function getProfile() {
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
		}
	}

	getProfile();

	return { username, credits, getProfile };
}
