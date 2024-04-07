export type Vote = {
	profiles: {
		username: string;
		first_vote: number;
	};
	image_urls: string[];
	user_id: string;
};

export type Choice = {
	id: number;
	title: string;
	images: string[];
	username: string;
	category?: string;
	closeAt?: string;
	removeAt?: string;
	isClosed?: boolean;
	isRemoved?: boolean;
	votes: Partial<Vote>[];
	uuid: string;
	visibility?: 'public' | 'private' | 'promoted';
};

export async function useChoice(id: number) {
	const supabase = useSupabaseClient<Database>();

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
				votes (image_urls, user_id, profiles (username, first_vote)),
				uuid,
				visibility
				`
			)
			.eq('id', id)
			.single();

		if (choiceResponse.error) throw choiceResponse.error;

		data.choice.username = choiceResponse.data.profiles?.username ?? '';
		data.choice.title = choiceResponse.data.title!;
		data.choice.images = choiceResponse.data.image_urls!;
		data.choice.category = choiceResponse.data.category ?? undefined;
		data.choice.closeAt = choiceResponse.data.close_at ?? undefined;
		data.choice.removeAt = choiceResponse.data.remove_at ?? undefined;
		data.choice.isClosed = isPast(choiceResponse.data.close_at);
		data.choice.isRemoved = isPast(choiceResponse.data.remove_at);
		data.choice.votes = choiceResponse.data.votes as Vote[];
		data.choice.uuid = choiceResponse.data.uuid;
		data.choice.visibility = choiceResponse.data.visibility;
	} catch (error: any) {
		console.error(error.message);
	} finally {
		data.loading = false;
	}

	return { ...data.choice, loading: data.loading };
}

function isPast(dateISO?: string | null) {
	if (!dateISO) return false;

	const date = new Date(dateISO);

	return date < new Date();
}
