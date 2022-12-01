export async function useMyProfile() {
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();

	const data = reactive({
		loading: true,
		userId: user.value?.id,
		email: user.value?.email,
		username: '',
		credits: null as null | number,
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
			data.loading = false;
		} catch (error: any) {
			console.log(error.message);
		} finally {
			data.loading = false;
		}
	}

	return data;
}
