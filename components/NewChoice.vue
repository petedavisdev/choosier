<template>
	<form>
		<section>
			<h2><label for="title">Title</label></h2>
			<input v-model="data.title" class="TitleInput" maxlength="25" required />
			<small>E.g. "Which color is best?". Up to 25 characters</small>
		</section>

		<section class="fullwidth">
			<h2>Images</h2>
			<p>You can add 2 to 10 images URLs</p>
			<div
				v-for="(url, index) in data.imageValues"
				:key="index"
				class="ImageField"
			>
				<input
					v-model="data.imageValues[index]"
					placeholder="https://..."
					class="ImageInput"
					:required="index < 2"
				/>

				<img
					v-if="imageURLs[index]"
					class="Image"
					:src="imageURLs[index] && getSrc(imageURLs[index])"
				/>
			</div>
		</section>

		<section>
			<h2>Category</h2>
			<p v-for="(category, index) in categories" :key="index">
				<label>
					<input
						type="radio"
						v-model="data.category"
						:value="category"
						required
					/>
					{{ category }}
				</label>
			</p>
		</section>

		<section>
			<h2>Visibility</h2>
			<p>
				You have {{ profile.credits }} credit{{
					profile.credits === 1 ? '' : 's'
				}}. <NuxtLink to="/credits">Get more credits</NuxtLink>
			</p>
			<p v-for="(text, name) in visibility" :key="name">
				<label>
					<input
						type="radio"
						v-model="data.visibility"
						:value="name"
						:disabled="name === 'Private'"
						required
					/>
					{{ name }} <small>{{ text }}</small>
				</label>
			</p>
		</section>

		<section>
			<h2>Listing preview</h2>
			<NewChoicePreview
				:images="imageURLs"
				:title="data.title"
				:username="profile.username"
			/>
		</section>

		<section>
			<p>
				{{
					!data.title
						? 'You need a title!'
						: imageURLs.length < 2
						? 'You need at least 2 images!'
						: !data.category
						? 'Choose a category'
						: 'Looking good!'
				}}
			</p>
			<button type="submit" class="button">Save and publish</button>
		</section>
	</form>
</template>

<script setup lang="ts">
import { getSrc } from '~/helpers/getSrc';

const visibility = {
	Promoted: '- homepage + Instagram (1 credit)',
	Public: '- anyone can vote and share (free)',
	Private: '- coming soon... (1 credit)',
};

const categories = [
	'Architecture',
	'Art and illustration',
	'Fashion',
	'Graphic design',
	'Interior design and homewares',
	'Pattern and surface design',
	'Photography',
	'Product design',
	'Other',
];

const profile = await useMyProfile();
const data = reactive({
	title: '',
	imageValues: ['', '', '', '', '', '', '', '', '', ''],
	category: '',
	visibility: 'Public',
});

const imageURLs = computed(() => data.imageValues.filter((value) => value));
</script>

<style scoped>
form {
	display: grid;
	gap: 1em;
}

.TitleInput {
	display: block;
	width: 100%;
	max-width: 25em;
}

.ImageField {
	display: grid;
	margin-bottom: 1em;
	grid-template-columns: 1fr 3em;
}

.ImageInput:focus::placeholder {
	color: transparent;
}
</style>
