export async function useChoice(id: number) {
	const supabase = useSupabaseClient();

	const data = reactive({
		loading: true,
		username: '',
		title: '',
		images: [],
	});

	try {
		const choiceResponse = await supabase
			.from('choices')
			.select(
				`
				profiles!choices_email_fkey(username),
				title,
				image_urls
				`
			)
			.eq('id', id)
			.single();

		if (choiceResponse.error) throw choiceResponse.error;

		// @ts-ignore: unreachable type error
		data.username = choiceResponse.data.profiles?.username;
		data.title = choiceResponse.data.title;
		data.images = choiceResponse.data.image_urls;
	} catch (error: any) {
		console.error(error.message);
	} finally {
		data.loading = false;
	}

	return data;
}
