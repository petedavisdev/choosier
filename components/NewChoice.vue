<script setup lang="ts">
const router = useRouter();
const supabase = useSupabaseClient();
const profile = useProfile();

const data = reactive({
	loading: false,
	title: '',
	images: [] as string[],
	maxImages: +Object.keys(IMAGE_LIMITS)[0],
	category: '',
	visibility: 'public',
	duration: 1,
	showPreview: false,
});

const credits = computed(() => {
	const required =
		(IMAGE_LIMITS[data.maxImages as keyof typeof IMAGE_LIMITS] || 0) +
		(VISIBILITIES[data.visibility as keyof typeof VISIBILITIES]?.credits || 0) +
		(DURATIONS[data.duration as keyof typeof DURATIONS]?.credits || 0);

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
	return data.images.length < MIN_IMAGES
		? `You need at least ${MIN_IMAGES} images!`
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
		  }, but you have ${profile.credits.value}.`
		: '';
});

async function submit() {
	if (
		data.images.length >= MIN_IMAGES &&
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
					user_id: profile.userId.value,
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
					{ credits_used: profile.creditsUsed.value + credits.value.required }
				)
				.eq('user_id', profile.userId.value);

			if (profilesResponse.error) throw profilesResponse.error;

			profile.credits.value = credits.value.remaining;

			router.push(PATHS.user + profile.username.value);
		} catch (error: any) {
			alert(error.message);
		} finally {
			data.loading = false;
		}
	}
}

function closePreview() {
	data.showPreview = false;
}
</script>

<template>
	<UserLogin v-if="!profile.userId.value">
		<h2>Login/register</h2>
	</UserLogin>

	<UserEdit v-else-if="!profile.username.value">
		<h2>
			<label for="username">My choosername</label>
		</h2>
	</UserEdit>

	<form v-else @submit.prevent="submit" :class="$style.form">
		<section id="images">
			<Credits />

			<h2>Images</h2>
			<p v-for="(credits, max) in IMAGE_LIMITS" :key="max">
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
							{{ credits ? `(${credits} credits)` : '(free)' }}
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
			<input
				v-model="data.title"
				maxlength="25"
				required
				:class="$style.titleInput"
			/>
			<small>{{
				data.title.length > 15
					? `${25 - data.title.length} characters remaining`
					: '&nbsp;'
			}}</small>
		</section>

		<section id="categories">
			<h2>Category</h2>
			<p v-for="(category, key) in CATEGORIES" :key="key">
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
			<p v-for="(value, key) in VISIBILITIES" :key="key">
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
							{{ value.credits ? `(${value.credits} credits)` : '(free)' }}
						</strong>
						{{ value.description }}
					</small>
				</label>
			</p>
		</section>

		<section id="duration">
			<h2>Duration</h2>
			<p v-for="(value, key) in DURATIONS" :key="key">
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
							{{ value.credits ? `(${value.credits} credits)` : '(free)' }}
						</strong>
						{{ value.description }}
					</small>
				</label>
			</p>
		</section>

		<section id="subscriptions">
			<h2>My subscriptions</h2>
			<UserSubscriptions />
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
					}}
					and you will have {{ credits.remaining }} remaining.
				</p>

				<button
					type="submit"
					class="button"
					:disabled="
						data.images.length < MIN_IMAGES ||
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

<style module>
.form {
	display: grid;
	gap: 1em;
}

.titleInput {
	width: 100%;
}
</style>
