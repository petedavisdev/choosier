<script setup lang="ts">
// import { toJpeg } from 'html-to-image';

const props = defineProps<{
	images: string[];
	title: string;
	username: string;
	validationMessage: string;
	close: () => void;
}>();

// const data = reactive({
// 	cardImage: '',
// });

const cardImagesElement = ref(null);

// const IMAGE_OPTIONS = {
// 	quality: 0.7,
// 	pixelRatio: 5 / 3,
// };

// function save() {
// 	if (data.cardImage) return;

// 	toJpeg(cardImagesElement.value!, IMAGE_OPTIONS).then((dataUrl) => {
// 		data.cardImage = dataUrl;
// 	});
// }
</script>

<template>
	<div :class="$style.container">
		<div id="preview" class="backdrop" @click="props.close"></div>
		<section class="box" :class="$style.box">
			<button @click="props.close" type="button" class="close"></button>

			<h2 v-if="props.validationMessage">{{ props.validationMessage }}</h2>

			<template v-else>
				<h2>Listing preview</h2>
				<!-- TODO:
				<button @click="save" type="button">Save</button>
				<img :src="data.cardImage" alt="" />
 -->
				<div class="card" :class="$style.card">
					<div ref="cardImagesElement" class="cardImages">
						<img
							class="cardImage"
							v-for="image in props.images"
							:src="image.replace('h_800', 'h_320')"
							alt=""
							loading="lazy"
							height="320"
							width="320"
						/>
					</div>

					<div class="cardTitle">
						<small>Help @{{ props.username }} choose</small>
						<div>{{ props.title || 'No title' }}</div>
					</div>
				</div>
				<slot />
			</template>
		</section>
	</div>
</template>

<style module>
.container {
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
}
.box {
	position: relative;
	z-index: 1;
	width: 100%;
	max-width: 30em;
}
.card {
	cursor: unset;
	margin-bottom: 2em;
}
</style>
