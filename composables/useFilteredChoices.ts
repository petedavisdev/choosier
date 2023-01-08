import { type Choice } from './useChoice';

export async function useFilteredChoices(
	filter: [string, string | number | number[]],
	open?: boolean
) {
	const supabase = useSupabaseClient();
	const now = new Date().toISOString();
	const dateLimit = open ? 'close_at' : 'remove_at';

	let filterEq = ['', ''] as [string, string];
	let filterIn = ['', []] as [string, number[]];
	if (typeof filter[1] === 'string' || typeof filter[1] === 'number') {
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
				image_urls,
				close_at
				`
			)
			.neq('visibility', 'private')
			.eq(...filterEq)
			.in(...filterIn)
			.gt(dateLimit, now)
			.order('created_at', { ascending: false });

		if (response.error) throw response.error;

		data.choices = response.data.map((choice) => ({
			id: choice.id,
			title: choice.title,
			images: choice.image_urls,
			// @ts-ignore: unreachable type error
			username: choice.profiles?.username,
			closeAt: choice.close_at,
		}));
	} catch (error: any) {
		console.error(error.message);
	} finally {
		data.loading = false;
	}

	return data.choices;
}
