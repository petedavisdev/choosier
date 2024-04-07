import type { Choice } from './useChoice';

export async function useFilteredChoices(
	filter: [string, string | number | number[]],
	onlyOpen = false,
	minVotes = 0
) {
	const supabase = useSupabaseClient<Database>();
	const now = new Date().toISOString();
	const dateLimit = onlyOpen ? 'close_at' : 'remove_at';

	let filterInclude: [string, number[]] = ['', []];
	let filterEqual: [string, string | number] = ['', ''];

	if (Array.isArray(filter[1])) {
		filterInclude = filter as [string, number[]];
	} else {
		filterEqual = filter as [string, string | number];
	}

	const data = reactive({
		choices: [] as Pick<Choice, 'id' | 'username' | 'title' | 'votes'>[],
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
				votes (image_urls)
				`
			)
			.neq('visibility', 'private')
			.eq(...filterEqual)
			.in(...filterInclude)
			.gt(dateLimit, now)
			.order('created_at', { ascending: false });

		if (response.error) throw response.error;

		data.choices = response.data
			.map((choice) => ({
				id: choice.id,
				title: choice.title ?? '',
				username: choice.profiles?.username ?? '',
				votes: choice.votes as { image_urls: string[] }[],
			}))
			.filter((choice) => choice.votes.length >= minVotes);
	} catch (error: any) {
		console.error(error.message);
	} finally {
		data.loading = false;
	}

	return data.choices;
}
