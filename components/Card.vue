<template>
	<NuxtLink :to="to" class="Card">
		<div class="Images">
			<span
				class="Image"
				v-for="image in images"
				:style="{ backgroundImage: `url(${image && getSrc(image)})` }"
			></span>
		</div>
		<h3 class="Title">
			<small class="TitleIntro">Help Fithacker choose</small>
			Logo colors
		</h3>
	</NuxtLink>
</template>

<script setup lang="ts">
import images from '~/public/data/FithackerColors.json';
import { getSrc } from '~/helpers/getSrc';

defineProps<{ to: string }>();
</script>

<style scoped>
.Card {
	margin-block: 1em;
	aspect-ratio: 7/3;
	display: flex;
	flex-direction: column;
	border-radius: 0.5em;
	color: var(--darker);
	text-decoration: none;
	background-color: #f6f6f6;
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
	color: #444;
}
</style>
