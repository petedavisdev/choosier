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
			<p>Add between 2 and 8 images.</p>

			<div class="grid" v-if="data.images.length">
				<img
					v-for="(image, index) in data.images"
					:key="index"
					:src="image"
					alt=""
				/>
			</div>

			<Upload
				v-if="data.images.length < 8"
				@uploaded="(url) => (data.images = [...data.images, url])"
			/>
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
					>Get credits</a
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
				:images="data.images"
				:title="data.title"
				:username="profile.username"
			/>
		</section>

		<footer>
			<p>
				{{
					!data.title
						? 'You need a title!'
						: data.images.length < 2
						? 'You need at least 2 images!'
						: !data.category
						? 'Choose a category'
						: 'Looking good!'
				}}
			</p>
			<button
				type="submit"
				class="button"
				:disabled="data.images.length < 2 || data.loading"
			>
				Save and publish
			</button>
		</footer>
	</form>
</template>

<script setup lang="ts">
import { categories, visibility } from '~/constants';

const supabase = useSupabaseClient();
const router = useRouter();

const profile = await useMyProfile();
const data = reactive({
	loading: false,
	title: '',
	images: [] as string[],
	category: '',
	visibility: 'Public',
	showCredits: false,
});

async function submit() {
	data.loading = true;

	try {
		const response = await supabase.from('choices').insert([
			// @ts-ignore: Unreachable code error
			{
				title: data.title,
				image_urls: data.images,
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
	width: 100%;
}
</style>
