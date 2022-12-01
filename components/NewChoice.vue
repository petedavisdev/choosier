<template>
	<form>
		<h2><label for="title">Title</label></h2>
		<input v-model="data.title" class="TitleInput" maxlength="25" required />
		<small>E.g. "Which color is best?". Up to 25 characters</small>

		<h2>Images</h2>
		<p>You can add 2 to 10 images URLs</p>

		<input
			v-for="(url, index) in data.imageValues"
			:key="index"
			v-model="data.imageValues[index]"
			placeholder="https://..."
			class="ImageInput"
			:required="index < 2"
		/>

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

		<h2>Listing preview</h2>
		<section class="grid">
			<NewChoicePreview
				:images="imageURLs"
				:title="data.title"
				:username="profile.username"
			/>
		</section>
		<button type="submit" class="button">Save and publish</button>
	</form>
</template>

<script setup lang="ts">
const visibility = {
	Promoted: 'on our homepage and Instagram (1 credit)',
	Public: '- anyone can view, vote and share (free)',
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
.TitleInput {
	display: block;
	width: 25em;
	max-width: 100%;
}

.ImageInput {
	display: block;
	width: 100%;
	margin-bottom: 1em;
}

.ImageInput:focus::placeholder {
	color: transparent;
}

.ImageInput:placeholder-shown + .ImageInput:nth-of-type(n + 8) {
	display: none;
}
</style>
