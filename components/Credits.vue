<script setup lang="ts">
const { profile } = useProfile();
</script>

<template>
	<h2 v-if="profile?.choices">
		You have <strong>{{ profile?.credits }}</strong> credit{{
			profile?.credits === 1 ? '' : 's'
		}}.
	</h2>

	<h3 v-else>
		We've given you <strong>{{ profile?.credits }}</strong> free credit{{
			profile?.credits === 1 ? '' : 's'
		}}
		so you can start creating image polls!
	</h3>

	<p>
		Earn more credits by sharing your choices with new people. You will earn 1
		credit for each first-time chooser on your results page.
	</p>
</template>
