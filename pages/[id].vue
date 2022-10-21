<template>
	<Choose :id="(route.params.id as string)" />
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
});
const route = useRoute();

onMounted(() => {
	window.scrollBy(0, 500);
});
</script>
