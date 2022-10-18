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
	margin-block: 1.5em;
	padding: 0.5em 0.5em 0;
	aspect-ratio: 1.91/1;
	display: flex;
	flex-direction: column;
	color: var(--darker);
	background-color: var(--lighter);
	text-decoration: none;
	box-shadow: -6px 8px var(--darker);
	border: 2px solid var(--darker);
	overflow: hidden;
	transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
	cursor: pointer;
}

.Card:hover {
	background-color: white;
	transform: translateY(-1px);
	box-shadow: -8px 10px var(--darker);
}

.Images {
	flex-grow: 1;
	display: flex;
	align-items: stretch;
	gap: 1px;
	overflow: hidden;
}

.Image {
	flex-grow: 1;
	background-size: cover;
	background-position: center;
}

.Title {
	padding-inline: 0.5em;
}

.TitleIntro {
	display: block;
	font-weight: normal;
	color: #333;
}
</style>
