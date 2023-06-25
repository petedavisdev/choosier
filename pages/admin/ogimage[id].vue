<script setup lang="ts">
definePageMeta({
	layout: false,
});

const route = useRoute();
const id = route.params.id;
const choice = await useChoice(id);
</script>

<template>
	<div class="backdrop">
		<div class="cardImages" :class="$style.images">
			<img
				v-for="(image, index) in choice.images"
				:src="image"
				:key="index"
				class="cardImage"
			/>
		</div>
	</div>
</template>

<style module>
.images {
	width: 1200px;
	height: 630px;
}
</style>
