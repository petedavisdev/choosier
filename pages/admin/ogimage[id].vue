<template>
	<div class="backdrop">
		<div class="card-images">
			<img
				v-for="(image, index) in choice.images"
				:src="image"
				:key="index"
				class="card-image"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
});

const route = useRoute();
const id = +route.params.id;
const choice = await useChoice(id);
</script>

<style scoped>
.card-images {
	width: 1200px;
	height: 630px;
}
</style>
