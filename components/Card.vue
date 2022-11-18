<template>
	<NuxtLink :to="`/${id}`" class="Card button">
		<div class="Images">
			<span
				class="Image"
				v-for="image in choice.images"
				:style="{ backgroundImage: `url(${image && getSrc(image)})` }"
			></span>
		</div>

		<h3 class="Title">
			<small class="TitleIntro">Help @{{ choice.username }} choose</small>
			{{ choice.title }}
		</h3>
	</NuxtLink>
</template>

<script setup lang="ts">
import { getSrc } from '~/helpers/getSrc';

const props = defineProps<{ id: number }>();
const choice = await useChoice(props.id);
</script>

<style scoped>
.Card {
	padding: 0.75em 0.75em 0;
	aspect-ratio: 1.91/1;
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
