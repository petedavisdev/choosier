<script setup lang="ts">
import type { Choice } from '../composables/useChoice';

const supabase = useSupabaseClient<Database>();
const { profile } = useProfile();
const route = useRoute();
const id = +route.params.id!;

const data = reactive({
	isCreator: false,
	isVoter: false,
	isPrivate: false,
	votingSystem: '2' as Choice['votingSystem'],
	uuid: '',
});

try {
	const response = await supabase
		.from('choices')
		.select(
			`
			visibility,
			user_id,
			uuid,
			voting_system,
			votes (user_id)
			`
		)
		.eq('id', id)
		.single();

	if (response.error) throw new Error('Invalid choice id');

	data.isPrivate = response.data.visibility === 'private';
	data.isCreator = response.data.user_id === profile.value?.userId;
	data.isVoter = !!response.data.votes.find(
		(vote) => vote.user_id === profile.value?.userId
	);
	data.votingSystem = response.data.voting_system;
	data.uuid = response.data.uuid;

	if (data.isPrivate && !data.isCreator && !data.isVoter)
		throw new Error('Access denied');
} catch {
	navigateTo(PATHS.home);
}
</script>

<template>
	<Results
		:id="id"
		:is-private="data.isPrivate"
		:is-creator="data.isCreator"
		:is-voter="data.isVoter"
		:voting-system="data.votingSystem"
		:uuid="data.uuid"
	/>
</template>
