<template>
	<div class="backdrop">
		<div class="cardImages">
			<img
				v-for="(image, index) in choice.images"
				:src="image"
				:key="index"
				class="cardImage"
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
.cardImages {
	width: 1200px;
	height: 630px;
}
</style>
