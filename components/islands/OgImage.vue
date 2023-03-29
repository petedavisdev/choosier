<script setup lang="ts">
const props = defineProps<{
	images: string[];
}>();
</script>

<template>
	<div class="images">
		<img v-if="props.images[0]" :src="props.images[0]" class="image" />
		<img v-if="props.images[1]" :src="props.images[1]" class="image" />
		<img v-if="props.images[2]" :src="props.images[2]" class="image" />
		<img v-if="props.images[0]" :src="props.images[3]" class="image" />
		<img v-if="props.images[1]" :src="props.images[4]" class="image" />
		<img v-if="props.images[2]" :src="props.images[5]" class="image" />
		<img v-if="props.images[0]" :src="props.images[6]" class="image" />
		<img v-if="props.images[1]" :src="props.images[7]" class="image" />
		<img v-if="props.images[2]" :src="props.images[8]" class="image" />
		<img v-if="props.images[0]" :src="props.images[9]" class="image" />
	</div>
</template>

<style scoped>
.images {
	width: 1200px;
	height: 630px;
	grid-area: one;
	display: grid;
	grid-auto-flow: column;
	overflow: hidden;
}

.image {
	height: 100%;
	width: 100%;
	object-fit: cover;
}
</style>
