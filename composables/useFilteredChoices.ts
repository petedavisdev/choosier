import { Choice } from '~/types';

export async function useFilteredChoices(filter: [string, string | number[]]) {
	const supabase = useSupabaseClient();
	const now = new Date().toISOString();

	let filterEq = ['', ''] as [string, string];
	let filterIn = ['', []] as [string, number[]];
	if (typeof filter[1] === 'string') {
		filterEq = filter as [string, string];
	} else {
		filterIn = filter as [string, number[]];
	}

	const data = reactive({
		choices: [] as Choice[],
		loading: true,
	});

	try {
		const response = await supabase
			.from('choices')
			.select(
				`
                id,
				profiles!choices_user_id_fkey(username),
				title,
				image_urls
				`
			)
			.neq('visibility', 'private')
			.eq(...filterEq)
			.in(...filterIn)
			.gt('remove_at', now)
			.order('created_at', { ascending: false });

		if (response.error) throw response.error;

		data.choices = response.data.map((choice) => ({
			id: choice.id,
			title: choice.title,
			images: choice.image_urls,
			username: choice.profiles?.username,
		}));
	} catch (error: any) {
		console.error(error.message);
	} finally {
		data.loading = false;
	}

	return data.choices;
}
