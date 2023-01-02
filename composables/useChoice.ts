import { Choice } from '~/types';

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
		data.choice.ogimage = choiceResponse.data.ogimage;
	} catch (error: any) {
		console.error(error.message);
	} finally {
		data.loading = false;
	}

	return { ...data.choice, loading: data.loading };
}
