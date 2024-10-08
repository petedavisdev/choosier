<script setup lang="ts">
const route = useRoute();
const quantity = route.params.quantity;
const { profile } = useProfile();
</script>

<template>
	<h1>Success!</h1>
	<p>
		{{ quantity }} credits have been added. You now have
		{{ profile?.credits }} credits.
	</p>
</template>
