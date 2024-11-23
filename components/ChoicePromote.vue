<script setup lang="ts">
import type { Choice } from '~/composables/useChoice';

const props = defineProps<{
	choice: Choice;
}>();

const { profile } = useProfile();

const boostCredits =
	VISIBILITIES.promoted.credits - VISIBILITIES.public.credits;

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
				credits_used: 5,
				visibility: 'promoted',
			})
			.eq('id', props.choice.id);

		if (choiceResponse.error) throw choiceResponse.error;

		const profileResponse = await supabase
			.from('profiles')
			.update({ credits_used: profile.value.creditsUsed + boostCredits })
			.eq('user_id', profile.value.userId);

		if (profileResponse.error) throw profileResponse.error;

		navigateTo(PATHS.user + profile.value.username);
	} catch (error: unknown) {
		alert((error as Error)?.message);
	}
}
</script>

<template>
	<section
		v-if="
			choice.visibility === 'public' && profile?.credits && profile.credits >= 4
		"
		class="box"
	>
		<template v-if="!choice.isClosed">
			<h2>Boost</h2>
			<p>Featured on the homepage with 6 more days to collect votes</p>
		</template>

		<template v-else>
			<h2>Need more votes?</h2>
			<p>Reopen for 6 more days and feature on the homepage</p>
		</template>

		<button type="button" class="button" @click="promoteChoice">
			Boost now ({{ boostCredits }} credits)
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

	<section v-else-if="!choice.isClosed" class="box">
		<Credits />
	</section>
</template>
