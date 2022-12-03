<template>
	<UserLogin v-if="!profile.userId" />
	<UserEdit v-else-if="!profile.username" />
	<form v-else>
		<section>
			<h2><label for="title">Title</label></h2>
			<input v-model="data.title" class="TitleInput" maxlength="25" required />
			<small>Up to 25 characters</small>
		</section>

		<section class="fullwidth">
			<h2>Images</h2>
			<p>You can add between 2 and 8 image URLs.</p>
			<p>
				I recommend uploading your images to a media library like
				<NuxtLink to="https://cloudinary.com/users/register_free"
					>Cloudinary</NuxtLink
				>
				and copying the URLs.
			</p>
			<div class="ImageFields">
				<label
					v-for="(url, index) in data.imageValues"
					:key="index"
					class="ImageField"
				>
					<img v-if="url" class="Image" :src="getSrc(url)" />
					<span v-else>{{ index + 1 }}.</span>

					<input
						v-model="data.imageValues[index]"
						placeholder="https://..."
						class="ImageInput"
						:required="index < 2"
					/>
				</label>
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
				}}.
				<a href="#credits" @click.prevent="data.showCredits = true"
					>Get more credits</a
				>

				<NewChoiceCredits
					v-if="data.showCredits"
					:close="closeCredits"
					:credits="profile.credits"
				/>
			</p>
			<p v-for="(text, name) in visibility" :key="name">
				<label>
					<input
						type="radio"
						v-model="data.visibility"
						:value="name"
						:disabled="
							name === 'Private' || (name === 'Promoted' && profile.credits < 1)
						"
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
	Promoted: '(1 credit) Choosier homepage + Instagram',
	Public: '(free)',
	Private: '(1 credit) Coming soon...',
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
	imageValues: ['', '', '', '', '', '', '', ''],
	category: '',
	visibility: 'Public',
	showCredits: false,
});

function closeCredits() {
	data.showCredits = !data.showCredits;
}

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

.ImageFields {
	display: grid;
	gap: 1em 0;
	grid-template-columns: max-content 1fr;
	align-items: center;
}

.ImageField {
	display: contents;
}

.Image {
	height: 2.9em;
	width: auto;
}

.ImageField span {
	min-width: 2.9em;
	text-align: center;
	place-self: center;
}

.ImageInput:focus::placeholder {
	color: transparent;
}
</style>