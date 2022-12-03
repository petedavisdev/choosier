<template>
	<NuxtLink :to="`/${id}`" class="Card button">
		<div class="Images">
			<span
				class="Image"
				v-for="image in choice.images"
				:style="{ backgroundImage: `url(${image && getSrc(image)})` }"
			></span>
		</div>

		<div class="Title">
			<small class="TitleIntro">Help @{{ choice.username }} choose</small>
			<strong>{{ choice.title }}</strong>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
import { getSrc } from '~/helpers/getSrc';

const props = defineProps<{ id: number }>();
const choice = await useChoice(props.id);
</script>

<style scoped>
.Card {
	aspect-ratio: 16 / 9;
	display: grid;
	grid-template-areas: 'x';
	padding: 0;
	text-decoration: none;
}

.Images {
	grid-area: x;
	display: grid;
	grid-auto-flow: column;
}

.Image {
	background-size: cover;
	background-position: center;
}

.Title {
	grid-area: x;
	justify-self: start;
	align-self: end;
	background-color: var(--light);
	padding: 0.5em 1em;
	box-shadow: var(--box-shadow);
	transition: transform 0.3s;
}

.TitleIntro {
	display: block;
	font-weight: normal;
}

.Card:hover .Title {
	background-color: white;
}
</style>
