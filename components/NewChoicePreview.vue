<template>
	<div class="Card box">
		<div class="Images">
			<span
				class="Image"
				v-for="image in props.images"
				:style="{ backgroundImage: `url(${image && getSrc(image)})` }"
			></span>
		</div>

		<h3 class="Title">
			<small class="TitleIntro">Help @{{ props.username }} choose</small>
			{{ props.title }}
		</h3>
	</div>
</template>

<script setup lang="ts">
import { getSrc } from '~~/helpers/getSrc';

const props = defineProps<{
	images: string[];
	title: string;
	username: string;
}>();
</script>

<style scoped>
.Card {
	padding: 0.75em 0.75em 0;
	aspect-ratio: 1.91/1;
	max-width: 25em;
	display: flex;
	flex-direction: column;
}

.Images {
	flex-grow: 1;
	display: flex;
	align-items: stretch;
	gap: 0.125em;
	overflow: hidden;
}

.Image {
	flex-grow: 1;
	background-size: cover;
	background-position: center;
}

.TitleIntro {
	display: block;
	font-weight: normal;
	color: #333;
}
</style>
