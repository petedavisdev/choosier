<script setup lang="ts">
definePageMeta({
	layout: false,
});

const route = useRoute();
const id = +route.params.id;
</script>

<template>
	<Choose :id="id" />
</template>
