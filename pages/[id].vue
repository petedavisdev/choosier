<script setup lang="ts">
definePageMeta({
	layout: false,
});
</script>

<template>
	<Choose :id="idToNumber($route.params.id)" />
</template>
