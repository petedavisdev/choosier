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

const imageEl = ref<HTMLElement>();

async function saveImage() {
	if (!imageEl.value) return;

	try {
		const imageUrl = await toJpeg(imageEl.value, { pixelRatio: 4 });

		if (imageUrl) {
			const link = document.createElement('a');
			link.href = imageUrl;
			link.download = `choosier-${props.id}-reddit.jpeg`;
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
			<h2>Reddit post</h2>

			<p>
				<button type="button" class="button" @click="saveImage">
					Save full-size reddit image
				</button>
			</p>

			<figure ref="imageEl" :class="$style.reddit">
				<div :class="$style.redditRows">
					<div :class="$style.redditImages">
						<img
							v-for="image in images1"
							:key="image"
							:class="$style.image"
							:src="image"
							alt=""
						/>
					</div>

					<div :class="$style.redditImages">
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
		</article>
	</section>
</template>

<style module>
.reddit {
	display: grid;
	grid-template: 1fr/1fr;
	grid-template-areas: 'main';
	place-content: center;
	font-size: small;
	margin: 0;
	padding: 0;
	cursor: pointer;
	width: 362px;
	height: 270px;
	background-color: var(--lighter);
	pointer-events: none;
}

.redditRows {
	display: grid;
	gap: 2px;
	grid-area: main;
	grid-template-rows: 134px 134px;
}

.redditImages {
	display: grid;
	grid-auto-flow: column;
	gap: 2px;
	overflow: hidden;
}

.image {
	height: 134px;
	width: 100%;
	object-fit: cover;
}

.text {
	place-self: center;
	grid-area: main;
	text-align: center;
	background-color: var(--lighter);
}
</style>
