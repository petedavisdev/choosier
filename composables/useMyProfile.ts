export async function useMyProfile() {
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();

	const data = reactive({
		loading: true,
		userId: user.value?.id,
		username: '',
	});

	try {
		const response = await supabase
			.from('profiles')
			.select(`username`)
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

	return data;
}
