<template>
	<div class="card">
		<div class="card-images">
			<img
				class="card-image"
				v-for="image in props.images"
				:src="image"
				alt=""
				loading="lazy"
				height="100"
				width="100"
			/>
		</div>

		<div class="card-title">
			<small>Help @{{ props.username }} choose</small>
			<div>{{ props.title || 'No title' }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	images: string[];
	title: string;
	username: string;
}>();
</script>

<style scoped>
.card {
	cursor: unset;
}
</style>
