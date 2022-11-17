<template>
	<h1>@{{ route.params.username as string }}</h1>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
