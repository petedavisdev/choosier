export type Choice = {
	id: number;
	title: string;
	images: string[];
	username: string;
	category?: string;
	closeAt?: string;
	removeAt?: string;
	ogimage?: string;
};

export async function useChoice(id: number) {
	const supabase = useSupabaseClient();

	const data = reactive({
		loading: true,
		choice: {} as Choice,
	});

	try {
		const choiceResponse = await supabase
			.from('choices')
			.select(
				`
				profiles!choices_user_id_fkey(username),
				title,
				image_urls,
				category,
				close_at,
				remove_at,
				ogimage
				`
			)
			.eq('id', id)
			.single();

		if (choiceResponse.error) throw choiceResponse.error;

		// @ts-ignore: unreachable type error
		data.choice.username = choiceResponse.data.profiles?.username;
		data.choice.title = choiceResponse.data.title;
		data.choice.images = choiceResponse.data.image_urls;
		data.choice.category = choiceResponse.data.category;
		data.choice.closeAt = choiceResponse.data.close_at;
		data.choice.removeAt = choiceResponse.data.remove_at;
		data.choice.ogimage = choiceResponse.data.ogimage;
	} catch (error: any) {
		console.error(error.message);
	} finally {
		data.loading = false;
	}

	return { ...data.choice, loading: data.loading };
}
