<template>
	<UserLogin v-if="!user">
		<h2>Login/register</h2>
	</UserLogin>
	<UserEdit v-else-if="!profile.username.value" />
	<form v-else @submit.prevent="submit">
		<section id="images">
			<h2>Images</h2>
			<p v-if="data.images.length < minImages">
				Add {{ minImages }} to {{ maxImages }} images.
			</p>

			<p v-if="data.images.length > maxImages">
				You have added more that {{ maxImages }} images! Please remove
				{{ data.images.length - maxImages }}.
			</p>

			<Upload
				@uploaded="(urls) => (data.images = urls)"
				:folder="profile.username.value"
				:max="maxImages"
			/>
		</section>

		<section id="title">
			<h2><label for="title">Title</label></h2>
			<input v-model="data.title" class="TitleInput" maxlength="25" required />
			<small>Up to 25 characters</small>
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
					profile.credits.value === 1 ? '' : 's'
				}}.
				<a href="#credits" @click.prevent="data.showCredits = true"
					>Get credits</a
				>

				<NewChoiceCredits
					v-if="data.showCredits"
					:close="closeCredits"
					:credits="profile.credits.value"
				/>
			</p>
			<p v-for="(text, name) in visibility" :key="name">
				<label>
					<input
						type="radio"
						v-model="data.visibility"
						:value="name"
						:disabled="
							name === 'Private' ||
							(name === 'Promoted' && profile.credits.value < 1)
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
				:username="profile.username.value"
			/>
		</section>

		<footer>
			<p>
				{{
					data.images.length < minImages
						? `You need at least ${minImages} images!`
						: data.images.length > maxImages
						? `You have more than ${maxImages} images!`
						: !data.title
						? 'You need a title!'
						: !data.category
						? 'Choose a category'
						: 'Looking good!'
				}}
			</p>
			<button
				type="submit"
				class="button"
				:disabled="
					data.images.length < minImages ||
					data.images.length > maxImages ||
					data.loading
				"
			>
				Save and publish
			</button>
		</footer>
	</form>
</template>

<script setup lang="ts">
import { categories, visibility } from '~/constants';

const router = useRouter();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const profile = useProfile();

const data = reactive({
	loading: false,
	title: '',
	images: [] as string[],
	category: '',
	visibility: 'Public',
	showCredits: false,
});

const minImages = 2;
const maxImages = 8;

async function submit() {
	try {
		data.loading = true;

		const response = await supabase.from('choices').insert([
			// @ts-ignore: Unreachable code error
			{
				title: data.title,
				image_urls: data.images,
				user_id: user.value?.id,
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
