export function useCover(id: number) {
	const supabase = useSupabaseClient();

	const COVER_OPTIONS = {
		// transform: {
		// 	width: 400,
		// 	height: 210,
		// },
	};

	const cover = supabase.storage
		.from('covers')
		.getPublicUrl(id + '.jpeg', COVER_OPTIONS);

	return cover.data.publicUrl;
}
