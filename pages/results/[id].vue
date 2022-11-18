<template>
	<Results :id="id" />
</template>

<script setup lang="ts">
const route = useRoute();
const id = +route.params.id;
</script>

<style>
small {
	display: block;
	font-size: 1rem;
}
</style>
