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
			<p v-for="(value, key) in visibility" :key="key">
				<label>
					<input
						type="radio"
						v-model="data.visibility"
						:value="key"
						:disabled="
							key === 'private' || profile.credits.value < value.credits
						"
						required
					/>
					{{ value.name }}
					<small>
						<strong>
							{{ value.credits ? `(${value.credits} credit)` : '(free)' }}
						</strong>
						{{ value.description }}
					</small>
				</label>
			</p>
		</section>

		<section id="duration">
			<h2>Duration</h2>
			You have {{ profile.credits }} credit{{
				profile.credits.value === 1 ? '' : 's'
			}}.
			<a href="#credits" @click.prevent="data.showCredits = true"
				>Get credits</a
			>

			<p v-for="(value, key) in duration" :key="key">
				<label>
					<input
						type="radio"
						v-model="data.duration"
						:value="key"
						:disabled="profile.credits.value < value.credits"
						required
					/>
					{{ value.name }}
					<small>
						<strong>
							{{ value.credits ? `(${value.credits} credit)` : '(free)' }}
						</strong>
						{{ value.description }}
					</small>
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
			<ul
				v-if="
					data.visibility &&
					data.duration &&
					creditsRequired <= profile.credits.value
				"
			>
				<li>
					Voting will close
					{{ dates.closeText }}
				</li>

				<li>
					Your results will be available until
					{{ dates.removeText }}
				</li>

				<li>
					You will have
					{{ profile.credits.value - creditsRequired }} credit{{
						profile.credits.value - creditsRequired === 1 ? '' : 's'
					}}
					left after publishing.
				</li>
			</ul>

			<p v-if="validationMessage">
				<strong>{{ validationMessage }}</strong>
			</p>

			<button
				type="submit"
				class="button"
				:disabled="
					data.images.length < minImages ||
					data.images.length > maxImages ||
					creditsRequired > profile.credits.value ||
					data.loading
				"
			>
				Save and publish
			</button>
		</footer>
	</form>
</template>

<script setup lang="ts">
import { categories, visibility, duration } from '~/constants';

const router = useRouter();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const profile = useProfile();

const data = reactive({
	loading: false,
	title: '',
	images: [] as string[],
	category: '',
	visibility: '',
	duration: 0,
	showCredits: false,
});

const creditsRequired = computed(() => {
	return (
		visibility[data.visibility as keyof typeof visibility]?.credits +
		duration[data.duration as keyof typeof duration]?.credits
	);
});

const dates = computed(() => {
	const date = new Date();

	date.setDate(date.getDate() + +data.duration);
	date.setSeconds(0, 0);
	const close = date.toISOString();
	const closeText = date.toLocaleString(undefined, {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		hour: 'numeric',
		minute: 'numeric',
	});

	date.setDate(date.getDate() + +data.duration + 0.007);
	const remove = date.toISOString();
	const removeText = date.toLocaleString(undefined, {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	});

	return { close, remove, closeText, removeText };
});

const validationMessage = computed(() => {
	return data.images.length < minImages
		? `You need at least ${minImages} images!`
		: data.images.length > maxImages
		? `You have more than ${maxImages} images!`
		: !data.title
		? 'You need a title!'
		: !data.category
		? 'Choose a category!'
		: !data.duration
		? 'Choose a duration!'
		: creditsRequired.value > profile.credits.value
		? `You need ${creditsRequired.value} credit${
				creditsRequired.value === 1 ? '' : 's'
		  }! Choose free options or get more credits.`
		: false;
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
				close_at: dates.value.close,
				remove_at: dates.value.remove,
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
