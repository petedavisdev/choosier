<script setup lang="ts">
const route = useRoute();
const id = +route.params.id;
</script>

<template>
	<Results :id="id" />
</template>
