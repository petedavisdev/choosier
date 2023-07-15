<script setup lang="ts">
const { profile } = useProfile();
</script>

<template>
	<h2>
		You have <strong>{{ profile?.credits }}</strong> credit{{
			profile?.credits === 1 ? '' : 's'
		}}.
	</h2>
	<p>
		You'll use <strong>1 credit</strong> to create a choice, plus any extras
		that you add.
	</p>
	<p>We've given you 10 credits to get you started!</p>
	<p>
		Earn more credits by sharing your choices with new people. You will earn 1
		credit for each first-time chooser on your results pages.
	</p>
</template>
