<template>
	<Choose :id="(route.params.id as string)" />
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
});
const route = useRoute();
</script>
