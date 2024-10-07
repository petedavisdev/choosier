<script setup lang="ts">
const { profile } = useProfile();
</script>

<template>
	<h3 v-if="profile?.choices">
		You have <strong>{{ profile?.credits }}</strong> credit{{
			profile?.credits === 1 ? '' : 's'
		}}
	</h3>

	<h3 v-else>
		We've given you <strong>{{ profile?.credits }}</strong> free credits so you
		can start creating image polls!
	</h3>

	<small>
		You can <LinkTo :to="PATHS.credits">buy more credits</LinkTo> or earn them
		by sharing your polls with new people. You will earn 1 credit for each
		first-time voter on your results page.
	</small>
</template>
