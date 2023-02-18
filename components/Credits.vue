<template>
	<h2>
		You have <strong>{{ profile.credits.value }}</strong> credit{{
			profile.credits.value === 1 ? '' : 's'
		}}.
	</h2>
	<p>You do not need credits to create choices, just for bonus features.</p>
	<p>
		Earn credits by sharing your choices with new people. You will earn 1 credit
		for each first-time chooser on your results page.
	</p>
</template>

<script setup lang="ts">
const profile = useProfile();
</script>
