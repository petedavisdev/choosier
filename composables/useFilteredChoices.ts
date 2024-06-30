import type { Choice } from './useChoice';

export async function useFilteredChoices(
	filter: [string, string | number | number[]],
	onlyOpen = false,
	allowPrivate = false
) {
	const supabase = useSupabaseClient<Database>();
	const now = new Date().toISOString();
	const dateLimit = onlyOpen ? 'close_at' : 'remove_at';

	let query = supabase
		.from('choices')
		.select(
			'id, profiles!choices_user_id_fkey(username), title, votes(image_urls), visibility, uuid'
		)
		.neq('visibility', allowPrivate ? 'removed' : 'private')
		.neq('visibility', 'removed')
		.gt(dateLimit, now)
		.order('created_at', { ascending: false });

	if (Array.isArray(filter[1])) {
		query = query.in(...(filter as [string, number[]]));
	} else if (filter[1]) {
		query = query.eq(...(filter as [string, number]));
	}

	const data = reactive({
		choices: [] as (Pick<
			Choice,
			'id' | 'username' | 'title' | 'visibility' | 'uuid'
		> & { votes: { image_urls: string[] }[] })[],
		loading: true,
	});

	try {
		const response = await query;

		if (response.error) throw response.error;

		data.choices = response.data
			.map((choice) => ({
				id: choice.id,
				title: choice.title ?? '',
				username: choice.profiles?.username ?? '',
				votes: choice.votes as { image_urls: string[] }[],
				visibility: choice.visibility,
				uuid: choice.uuid,
			}))
			.sort((a, b) => b.votes.length - a.votes.length);
	} catch (error: unknown) {
		if (error instanceof Error) console.error(error.message);
	} finally {
		data.loading = false;
	}

	return data.choices;
}
