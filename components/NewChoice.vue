<template>
	<UserLogin v-if="!profile.userId" />
	<UserEdit v-else-if="!profile.username" />
	<form v-else @submit.prevent="submit">
		<section id="title">
			<h2><label for="title">Title</label></h2>
			<input v-model="data.title" class="TitleInput" maxlength="25" required />
			<small>Up to 25 characters</small>
		</section>

		<section id="images">
			<h2>Images</h2>
			<p>You can add between 2 and 8 image URLs.</p>
			<p>
				Upload your images to a media library like
				<a
					href="https://cloudinary.com/users/register_free"
					target="_blank"
					rel="noopener noreferrer"
					>Cloudinary</a
				>
				and then copy the URLs.
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

		<section id="categories">
			<h2>Category</h2>
			<p v-for="(category, key) in categories" :key="key">
				<label>
					<input
						type="radio"
						name="category"
						v-model="data.category"
						:value="key"
						required
					/>
					{{ category }}
				</label>
			</p>
		</section>

		<section id="visibility">
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

		<section id="preview">
			<h2>Listing preview</h2>
			<NewChoicePreview
				:images="imageURLs"
				:title="data.title"
				:username="profile.username"
			/>
		</section>

		<footer>
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
			<button type="submit" class="button" :disabled="data.loading">
				Save and publish
			</button>
		</footer>
	</form>
</template>

<script setup lang="ts">
import { getSrc } from '~/helpers/getSrc';
import { categories, visibility } from '~/constants';

const supabase = useSupabaseClient();
const router = useRouter();

const profile = await useMyProfile();
const data = reactive({
	loading: false,
	title: '',
	imageValues: ['', '', '', '', '', '', '', ''],
	category: '',
	visibility: 'Public',
	showCredits: false,
});

const imageURLs = computed(() => data.imageValues.filter((value) => value));

async function submit() {
	data.loading = true;

	try {
		const response = await supabase.from('choices').insert([
			// @ts-ignore: Unreachable code error
			{
				title: data.title,
				image_urls: imageURLs.value,
				user_id: profile.userId,
				visibility: data.visibility,
				category: data.category,
			},
		]);

		if (response.error) throw response.error;

		router.push('/@' + profile.username);
	} catch (error: any) {
		alert(error.message);
	} finally {
		data.loading = false;
	}
}

function closeCredits() {
	data.showCredits = !data.showCredits;
}
</script>

<style scoped>
form {
	display: grid;
	gap: 1em;
}

.TitleInput {
	display: block;
	width: 100%;
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

[type='radio'] {
	margin-inline: 1em 0.5em;
}
</style>
