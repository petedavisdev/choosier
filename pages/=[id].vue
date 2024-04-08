<script setup lang="ts">
const supabase = useSupabaseClient<Database>();
const { profile } = useProfile();
const route = useRoute();
const id = +route.params.id;

const data = reactive({
	isCreator: false,
	isVoter: false,
	isPublic: true,
});

try {
	const response = await supabase
		.from('choices')
		.select(
			`
			visibility,
			user_id,
			votes (user_id)
			`
		)
		.eq('id', id)
		.single();

	if (response.error) throw new Error('Invalid choice id');

	data.isPublic = response.data.visibility !== 'private';
	data.isCreator = response.data.user_id === profile.value?.userId;
	data.isVoter = !!response.data.votes.find(
		(vote) => vote.user_id === profile.value?.userId
	);

	if (!data.isPublic && !data.isCreator && !data.isVoter)
		throw new Error('Access denied');
} catch {
	navigateTo(PATHS.home);
}
</script>

<template>
	<Results
		:id="id"
		:is-public="data.isPublic"
		:is-creator="data.isCreator"
		:is-voter="data.isVoter"
	/>
</template>
