<script setup lang="ts">
import type { Choice } from '~/composables/useChoice';

const props = defineProps<{
	id: number;
	choice: Choice;
}>();

const { profile } = useProfile();

async function promoteChoice() {
	if (!profile.value) return;

	const supabase = useSupabaseClient<Database>();

	const close_at = props.choice.closeAt
		? addDaysToISODate(6, props.choice.closeAt)
		: addDaysToISODate(7);

	const remove_at = props.choice.removeAt
		? addDaysToISODate(12, props.choice.removeAt)
		: addDaysToISODate(14);

	try {
		const choiceResponse = await supabase
			.from('choices')
			.update({ close_at, remove_at, credits_used: 5 })
			.eq('id', props.id);

		if (choiceResponse.error) throw choiceResponse.error;

		const profileResponse = await supabase
			.from('profiles')
			.update({ credits_used: profile.value.creditsUsed + 4 })
			.eq('user_id', profile.value.userId);

		if (profileResponse.error) throw profileResponse.error;

		navigateTo(PATHS.user + props.choice.username);
	} catch (error: any) {
		alert(error.message);
	}
}
</script>

<template>
	<form :class="$style.form" @submit.prevent="promoteChoice">
		<h2>Promote on the homepage and keep open for 7 days (+4 credits)</h2>

		<button class="button" type="submit">Promote now!</button>
	</form>
</template>

<style module>
.form {
	display: grid;
	gap: 1em;
}

.titleInput {
	width: 100%;
	max-width: 25em;
	display: block;
}
</style>
