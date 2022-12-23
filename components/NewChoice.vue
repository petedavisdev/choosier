<template>
	<UserLogin v-if="!user">
		<h2>Login/register</h2>
	</UserLogin>
	<UserEdit v-else-if="!profile.username.value" />
	<form v-else @submit.prevent="submit">
		<section id="images">
			<p>Choices are free, but you can use credits for bonus features.</p>
			<p>
				You have <strong>{{ profile.credits }}</strong> credit{{
					profile.credits.value === 1 ? '' : 's'
				}}.
				<a href="#credits" @click.prevent="data.showCredits = true"
					>Get credits</a
				>
			</p>
			<NewChoiceCredits
				v-if="data.showCredits"
				:close="closeCredits"
				:credits="profile.credits.value"
			/>

			<h2>Images</h2>
			<p v-for="(credits, max) in imageLimits" :key="max">
				<label
					:title="
						profile.credits.value < credits ? `Requires ${credits} credit` : ''
					"
				>
					<input
						type="radio"
						v-model="data.maxImages"
						:value="max"
						:disabled="profile.credits.value < credits"
						required
						@change="data.maxImages = max"
					/>
					up to {{ max }} images
					<small>
						<strong>
							{{ credits ? `(${credits} credit)` : '(free)' }}
						</strong>
					</small>
				</label>
			</p>

			<p v-if="data.images.length > data.maxImages">
				You have added more that {{ data.maxImages }} images! Please remove
				{{ data.images.length - data.maxImages }}.
			</p>

			<Upload
				@uploaded="(urls) => (data.images = urls)"
				:folder="profile.username.value"
				:max="data.maxImages"
			/>
		</section>

		<section id="title">
			<h2><label for="title">Title</label></h2>
			<input v-model="data.title" class="TitleInput" maxlength="25" required />
			<small>{{
				data.title.length > 15
					? `${25 - data.title.length} characters remaining`
					: '&nbsp;'
			}}</small>
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
			<p v-for="(value, key) in visibility" :key="key">
				<label
					:title="
						profile.credits.value < value.credits
							? `Requires ${value.credits} credit`
							: ''
					"
				>
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
			<p v-for="(value, key) in duration" :key="key">
				<label
					:title="
						profile.credits.value < value.credits
							? `Requires ${value.credits} credit`
							: ''
					"
				>
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

		<footer>
			<button @click="data.showPreview = true" type="button" class="button">
				Continue &rarr;
			</button>

			<NewChoicePreview
				v-if="data.showPreview"
				:images="data.images"
				:title="data.title"
				:username="profile.username.value"
				:validationMessage="validationMessage"
				:close="closePreview"
			>
				<p>
					Voting will close
					{{ dates.closeText }}.
				</p>

				<p>
					Your results will be available until
					{{ dates.removeText }}.
				</p>

				<p v-if="credits.required">
					You are using {{ credits.required }} credit{{
						credits.required === 1 ? '' : 's'
					}}.
				</p>

				<button
					type="submit"
					class="button"
					:disabled="
						data.images.length < minImages ||
						data.images.length > data.maxImages ||
						credits.required > profile.credits.value ||
						data.loading
					"
				>
					✓ Save and publish
				</button>
			</NewChoicePreview>
		</footer>
	</form>
</template>

<script setup lang="ts">
import { imageLimits, categories, visibility, duration } from '~/constants';

const router = useRouter();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const profile = useProfile();
const minImages = 2;

const data = reactive({
	loading: false,
	title: '',
	images: [] as string[],
	maxImages: +Object.keys(imageLimits)[0],
	category: '',
	visibility: 'public',
	duration: 1,
	showCredits: false,
	showPreview: false,
});

const credits = computed(() => {
	const required =
		(imageLimits[data.maxImages as keyof typeof imageLimits] || 0) +
		(visibility[data.visibility as keyof typeof visibility]?.credits || 0) +
		(duration[data.duration as keyof typeof duration]?.credits || 0);

	const remaining = profile.credits.value - required;

	return { required, remaining };
});

const dates = computed(() => {
	const updateOnPreview = data.showPreview;

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

	return { close, closeText, remove, removeText };
});

const validationMessage = computed(() => {
	return data.images.length < minImages
		? `You need at least ${minImages} images!`
		: data.images.length > data.maxImages
		? `You have more than ${data.maxImages} images!`
		: !data.title
		? 'You need a title!'
		: !data.category
		? 'Choose a category!'
		: !data.visibility
		? 'Choose visibility!'
		: !data.duration
		? 'Choose a duration!'
		: credits.value.required > profile.credits.value
		? `You have chosen to use ${credits.value.required} credit${
				credits.value.required === 1 ? '' : 's'
		  }, but you have ${
				profile.credits.value
		  }. Use the free options to get started.`
		: '';
});

async function submit() {
	if (
		data.images.length >= minImages &&
		data.images.length <= data.maxImages &&
		credits.value.remaining >= 0
	) {
		try {
			data.loading = true;

			const choicesResponse = await supabase.from('choices').insert([
				// @ts-ignore: Unreachable code error
				{
					title: data.title,
					image_urls: data.images,
					user_id: user.value?.id,
					visibility: data.visibility,
					category: data.category,
					close_at: dates.value.close,
					remove_at: dates.value.remove,
					credits_used: credits.value.required,
				},
			]);

			if (choicesResponse.error) throw choicesResponse.error;

			const profilesResponse = await supabase
				.from('profiles')
				.update(
					// @ts-ignore: Unreachable code error
					{ credits: credits.value.remaining }
				)
				.eq('user_id', user.value?.id);

			if (profilesResponse.error) throw profilesResponse.error;

			profile.credits.value = credits.value.remaining;

			router.push('/@' + profile.username.value);
		} catch (error: any) {
			alert(error.message);
		} finally {
			data.loading = false;
		}
	}
}

function closeCredits() {
	data.showCredits = false;
}

function closePreview() {
	data.showPreview = false;
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
