<script setup lang="ts">
definePageMeta({
	layout: false,
});
</script>

<template>
	<Choose :id="+$route.params.id" />
</template>
