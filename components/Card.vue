<template>
	<NuxtLink :to="`/${id}`" class="Card">
		<div class="Images">
			<span
				class="Image"
				v-for="image in images"
				:style="{ backgroundImage: `url(${image && getSrc(image)})` }"
			></span>
		</div>
		<h3 class="Title">
			<small class="TitleIntro">Help {{ username }} choose</small>
			<slot />
		</h3>
	</NuxtLink>
</template>

<script setup lang="ts">
import { getImages } from '~/helpers/getImages';
import { getSrc } from '~/helpers/getSrc';

const props = defineProps<{ id: string; username: string }>();

const images = getImages(props.id);
</script>

<style scoped>
.Card {
	margin: 1em -1em;
	aspect-ratio: 1.91/1;
	display: flex;
	flex-direction: column;
	color: var(--darker);
	background-color: #f6f6f6;
	text-decoration: none;
	border-radius: 1.5em;
	box-shadow: 0 0.3em 0.5em #0003;
	overflow: hidden;
	transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
	cursor: pointer;
}

.Card:hover {
	background-color: white;
	transform: translateY(-1px);
	box-shadow: 0 0.5em 0.6em #0006;
}

.Images {
	flex-grow: 1;
	display: flex;
	align-items: stretch;
	gap: 1px;
}

.Image {
	flex-grow: 1;
	background-size: cover;
	background-position: center;
}

.Title {
	padding-inline: 1em;
}

.TitleIntro {
	display: block;
	font-weight: normal;
	color: #333;
}
</style>
