<template>
	<div class="cen">
		<h1>
			<small>You helped Fithacker choose</small>
			Logo colors
		</h1>
		<p>Here are the results so far</p>
		<article v-for="(image, index) in images" :key="index">
			<img :src="getSrc(image)" alt="" />
			<div
				class="bar"
				:style="{ width: (100 * results[index]) / results[0] + '%' }"
			>
				<strong class="count">{{ results[index] }}</strong>
				<div class="mychoice" v-if="index === yourChoice">
					&larr; Your choice
				</div>
			</div>
		</article>
	</div>
</template>

<script setup lang="ts">
import { getImages } from '~/helpers/getImages';
import { getSrc } from '~/helpers/getSrc';

const props = defineProps<{ id: string }>();

const results = [73, 10, 5, 1, 0];
const yourChoice = 1;

const images = getImages(props.id);
</script>

<style scoped>
article {
	display: grid;
	grid-template-columns: 1fr 2fr;
	margin-top: 0.5em;
	max-width: 600px;
}

.bar {
	text-align: left;
	background-color: var(--mid);
}

.count {
	font-size: 3em;
	padding: 0.1em;
}

small {
	display: block;
	font-size: 1rem;
}

.mychoice {
	padding: 0.2em 0.5em;
	white-space: nowrap;
}

img {
	max-width: 100%;
	height: auto;
}
</style>
