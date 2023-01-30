<template>
	<p>
		You have <strong>{{ profile.credits.value }}</strong> credit{{
			profile.credits.value === 1 ? '' : 's'
		}}.
		<LinkTo to="/credits" target="_blank">Get credits</LinkTo>
	</p>
</template>

<script setup lang="ts">
const profile = useProfile();
</script>
