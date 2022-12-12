export async function useProfile() {
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const data = reactive({
		loading: true,
		userId: user.value?.id,
		email: user.value?.email,
		username: '',
		credits: 0,
	});

	if (user.value) {
		try {
			const response = await supabase
				.from('profiles')
				.select(`username, credits`)
				.eq('user_id', user.value?.id)
				.single();

			if (response.error) throw response.error;

			data.username = response.data.username;
			data.credits = response.data.credits;
			data.loading = false;
		} catch (error: any) {
			console.log(error.message);
		} finally {
			data.loading = false;
		}
	}

	return data;
}
