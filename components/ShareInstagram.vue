<script setup lang="ts">
import { toJpeg } from 'html-to-image';

const props = defineProps<{
	id: number;
	shareLink: string;
}>();

const displayLink = props.shareLink.replace(/(^\w+:|^)\/\//, '');

const { images, username } = await useChoice(props.id);
const { profile } = useProfile();

const name = profile.value?.username === username ? 'me' : username;

const halfLength = Math.ceil(images.length / 2);
const images1 = images.slice(0, halfLength);
const images2 = images.slice(halfLength, images.length);

const square = ref<HTMLElement>();
const story = ref<HTMLElement>();

async function saveImage(name: string, element?: HTMLElement) {
	if (!element) return;

	try {
		const imageUrl = await toJpeg(element, { pixelRatio: 4 });

		if (imageUrl) {
			const link = document.createElement('a');
			link.href = imageUrl;
			link.download = `choosier-${props.id}-${name}.jpeg`;
			link.click();
		}
	} catch (error) {
		console.error(error);
	}
}
</script>

<template>
	<section :class="$style.container">
		<article>
			<h2>Instagram post</h2>

			<p>
				<button
					type="button"
					class="button"
					@click="saveImage('square', square)"
				>
					Save full-size square image
				</button>
			</p>

			<figure ref="square" :class="$style.square">
				<div :class="$style.squareRows">
					<div :class="$style.squareImages">
						<img
							v-for="image in images1"
							:key="image"
							:class="$style.image"
							:src="image"
							alt=""
						/>
					</div>

					<div :class="$style.squareImages">
						<img
							v-for="image in images2"
							:key="image"
							:class="$style.image"
							:src="image"
							alt=""
						/>
					</div>
				</div>

				<div class="button" :class="$style.text">
					<small class="cardTitleIntro">Help {{ name }} choose</small>
					<div>{{ displayLink }}</div>
				</div>
			</figure>

			<p>#choosier #poll #helpmechoose</p>
		</article>

		<article>
			<h2>Story</h2>

			<p>
				<button type="button" class="button" @click="saveImage('story', story)">
					Save full-size story image
				</button>
			</p>
			<p>
				Don't forget to add a
				<a
					href="https://www.google.com/search?q=how+to+add+a+link+sticker+to+an+instagram+story"
					target="_blank"
				>
					link sticker</a
				>!
			</p>

			<figure ref="story" :class="$style.story">
				<div :class="$style.storyImages">
					<img
						v-for="image in images"
						:key="image"
						:class="$style.image"
						:src="image"
					/>
				</div>
			</figure>

			<p>Link to:</p>
			<h3>{{ displayLink }}</h3>
		</article>
	</section>
</template>

<style module>
.square,
.story {
	display: grid;
	grid-template: 1fr/1fr;
	grid-template-areas: 'main';
	place-content: center;
	font-size: small;
	margin: 0;
	padding: 0;
	cursor: pointer;
	width: 270px;
	aspect-ratio: 1;
	background-color: var(--lighter);
	pointer-events: none;
}

.story {
	aspect-ratio: 9/16;
}

.squareRows {
	display: grid;
	gap: 1px;
	grid-area: main;
	grid-template-rows: 1fr 1fr;
}

.squareImages,
.storyImages {
	display: grid;
	grid-auto-flow: column;
	gap: 1px;
	overflow: hidden;
}

.storyImages {
	writing-mode: vertical-rl;
	display: grid;
	gap: 1px;
	grid-area: main;
}

.image {
	height: 100%;
	width: 100%;
	object-fit: cover;
}

.text {
	place-self: center;
	grid-area: main;
	text-align: center;
}

@media (min-width: 600px) {
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3em;
	}
}
</style>
