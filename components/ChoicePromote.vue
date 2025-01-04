<script setup lang="ts">
import type { Choice } from '~/composables/useChoice';

const props = defineProps<{
	choice: Choice;
}>();

const { profile } = useProfile();

async function promoteChoice() {
	console.log('choice', props.choice);
	if (!profile.value) return;

	const supabase = useSupabaseClient<Database>();

	const close_at = addDaysToISODate(7, props.choice.createdAt);
	const remove_at = addDaysToISODate(7, close_at);

	try {
		const choiceResponse = await supabase
			.from('choices')
			.update({
				close_at,
				remove_at,
				visibility: 'promoted',
			})
			.eq('id', props.choice.id);

		if (choiceResponse.error) throw choiceResponse.error;

		navigateTo(PATHS.user + profile.value.username);
	} catch (error: unknown) {
		alert((error as Error)?.message);
	}
}
</script>

<template>
	<section v-if="choice.visibility === 'public'" class="box">
		<template v-if="!choice.isClosed">
			<h2>Boost</h2>
			<p>Featured on the homepage with 6 more days to collect votes</p>
		</template>

		<template v-else>
			<h2>Need more votes?</h2>
			<p>Reopen for 6 more days, featured on the homepage</p>
		</template>

		<button type="button" class="button" @click="promoteChoice">
			Boost now for

			<s v-if="'inactivePrice' in VISIBILITIES.promoted">
				{{ VISIBILITIES.promoted.inactivePrice }}
			</s>

			<strong>{{ VISIBILITIES.promoted.price }}</strong>
		</button>
	</section>

	<section
		v-else-if="choice.visibility === 'promoted' && !choice.isClosed"
		class="box"
	>
		<h2>This poll has been boosted</h2>
		<p>
			Featured on the <LinkTo :to="PATHS.home">homepage</LinkTo> and open for a
			week
		</p>
	</section>
</template>
