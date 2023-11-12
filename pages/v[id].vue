<script setup lang="ts">
definePageMeta({
	layout: false,
});
</script>

<template>
	<Vote :id="+$route.params.id" />
</template>
