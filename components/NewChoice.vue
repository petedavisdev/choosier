<script setup lang="ts">
import { toJpeg } from 'html-to-image';
import { decode } from 'base64-arraybuffer';

const supabase = useSupabaseClient();
const { profile } = useProfile();

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

const cardImagesElement = ref(null);

const credits = computed(() => {
	const required =
		1 +
		(IMAGE_LIMITS[data.maxImages as keyof typeof IMAGE_LIMITS] ?? 0) +
		(VISIBILITIES[data.visibility as keyof typeof VISIBILITIES]?.credits ?? 0) +
		(DURATIONS[data.duration as keyof typeof DURATIONS]?.credits ?? 0);

	const remaining = profile.value ? profile.value?.credits - required : 0;

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
		: profile.value && credits.value.required > profile.value.credits
		? `You have chosen to use ${credits.value.required} credit${
				credits.value.required === 1 ? '' : 's'
		  }, but you have ${profile.value?.credits}.`
		: '';
});

async function submit() {
	if (
		profile.value &&
		data.images.length >= MIN_IMAGES &&
		data.images.length <= data.maxImages &&
		credits.value.remaining >= 0
	) {
		try {
			data.loading = true;

			const choicesResponse = await supabase
				.from('choices')
				.insert([
					{
						title: data.title,
						image_urls: data.images,
						user_id: profile.value?.userId,
						visibility: data.visibility,
						category: data.category,
						close_at: dates.value.close,
						remove_at: dates.value.remove,
						credits_used: credits.value.required,
					},
				])
				.select();

			if (choicesResponse.error) throw choicesResponse.error;

			const profilesResponse = await supabase
				.from('profiles')
				.update(
					// @ts-ignore: Unreachable code error
					{ credits_used: profile.value?.creditsUsed + credits.value.required }
				)
				.eq('user_id', profile.value?.userId);

			if (profilesResponse.error) throw profilesResponse.error;

			profile.value.credits = credits.value.remaining;

			// @ts-ignore: Unreachable code error
			const newChoiceId = choicesResponse.data[0]?.id;

			createCover(newChoiceId);

			navigateTo(PATHS.user + profile.value?.username);
		} catch (error: any) {
			alert(error.message);
		} finally {
			data.loading = false;
		}
	}
}

async function createCover(id: number) {
	if (!cardImagesElement.value) return;

	const IMAGE_OPTIONS = {
		quality: 0.7,
		pixelRatio: 5 / 3,
	};

	try {
		const coverUrl = await toJpeg(cardImagesElement.value, IMAGE_OPTIONS);
		uploadCover(coverUrl, id);
	} catch (error) {
		alert('Error creating cover image!');
	}
}

async function uploadCover(coverUrl: string, id: number) {
	try {
		const coverBase64 = coverUrl.replace('data:image/jpeg;base64,', '');
		const coverFile = decode(coverBase64);
		const fileName = id + '.jpeg';

		let { error: uploadError } = await supabase.storage
			.from('covers')
			.upload(fileName, coverFile, { contentType: 'image/jpeg' });

		if (uploadError) throw uploadError;
	} catch (error: any) {
		alert(error.message);
	}
}

function closePreview() {
	data.showPreview = false;
}
</script>

<template>
	<UserLogin v-if="!profile">
		<h2>Login/register</h2>
	</UserLogin>

	<UserEdit v-else-if="!profile.username">
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
					:title="profile.credits < credits ? `Requires ${credits} credit` : ''"
				>
					<input
						type="radio"
						v-model="data.maxImages"
						:value="max"
						:disabled="profile.credits < credits"
						required
						@change="data.maxImages = max"
					/>
					up to {{ max }} images
					<small>
						<strong v-if="credits"> (+{{ credits }} credits) </strong>
					</small>
				</label>
			</p>

			<p v-if="data.images.length > data.maxImages">
				You have added more that {{ data.maxImages }} images! Please remove
				{{ data.images.length - data.maxImages }}.
			</p>

			<Upload
				@uploaded="(urls) => (data.images = urls)"
				:folder="profile?.username ?? '@'"
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
						profile.credits < value.credits
							? `Requires ${value.credits} credit`
							: ''
					"
				>
					<input
						type="radio"
						v-model="data.visibility"
						:value="key"
						:disabled="key === 'private' || profile.credits < value.credits"
						required
					/>
					{{ value.name }}
					<small>
						<strong v-if="value.credits">
							(+{{ value.credits }} credits)
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
						profile.credits < value.credits
							? `Requires ${value.credits} credit`
							: ''
					"
				>
					<input
						type="radio"
						v-model="data.duration"
						:value="key"
						:disabled="profile.credits < value.credits"
						required
					/>
					{{ value.name }}
					<small>
						<strong v-if="value.credits">
							(+{{ value.credits }} credits)
						</strong>
						{{ value.description }}
					</small>
				</label>
			</p>
		</section>

		<section v-if="!profile.subscriptions" id="subscriptions">
			<h2>My subscriptions</h2>
			<UserSubscriptions />
		</section>

		<footer>
			<button @click="data.showPreview = true" type="button" class="button">
				Continue &rarr;
			</button>

			<NewChoicePreview
				v-if="data.showPreview"
				:title="data.title"
				:username="profile.username"
				:validationMessage="validationMessage"
				:close="closePreview"
			>
				<template #card-images>
					<div ref="cardImagesElement" class="cardImages">
						<img
							class="cardImage"
							v-for="image in data.images"
							:src="image.replace('h_800', 'h_320')"
							alt=""
							loading="lazy"
							height="320"
							width="320"
						/>
					</div>
				</template>

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
						credits.required > profile.credits ||
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
