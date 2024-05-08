<script setup lang="ts">
import { toJpeg } from 'html-to-image';
import { decode } from 'base64-arraybuffer';

const supabase = useSupabaseClient<Database>();
const { profile } = useProfile();

const data = reactive({
	loading: false,
	title: '',
	images: [] as string[],
	category: '',
	visibility: 'public' as 'public' | 'private' | 'promoted',
	showPreview: false,
});

const cardImagesElement = ref(null);

const credits = computed(() => {
	const required =
		VISIBILITIES[data.visibility as keyof typeof VISIBILITIES]?.credits ?? 0;

	const remaining = profile.value ? profile.value?.credits - required : 0;

	return { required, remaining };
});

const dates = computed(() => {
	const date = new Date();
	const duration = data.visibility === 'public' ? 1 : 7;

	date.setDate(date.getDate() + duration);
	date.setSeconds(0, 0);
	const close = date.toISOString();

	date.setDate(date.getDate() + duration + 0.007);
	const remove = date.toISOString();

	return { close, remove };
});

const validationMessage = computed(() => {
	return data.images.length < MIN_IMAGES
		? `You need at least ${MIN_IMAGES} images!`
		: data.images.length > MAX_IMAGES
			? `You have more than ${MAX_IMAGES} images!`
			: !data.title
				? 'You need a title!'
				: !data.visibility
					? 'Choose visibility!'
					: !data.category && data.visibility !== 'private'
						? 'Choose a category!'
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
		data.images.length <= MAX_IMAGES &&
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
				.update({
					credits_used: profile.value?.creditsUsed + credits.value.required,
				})
				.eq('user_id', profile.value?.userId);

			if (profilesResponse.error) throw profilesResponse.error;

			profile.value.credits = credits.value.remaining;

			const newChoiceId = choicesResponse.data[0]?.id;

			const coverPath = await createCover(newChoiceId);

			console.log('coverPath', coverPath);

			if (coverPath) {
				console.log('coverUrl', useCover(newChoiceId));
				navigateTo(PATHS.new + newChoiceId);
			}
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
		return await uploadCover(coverUrl, id);
	} catch (error) {
		alert('Error creating cover image!');
	}
}

async function uploadCover(coverUrl: string, id: number) {
	try {
		const coverBase64 = coverUrl.replace('data:image/jpeg;base64,', '');
		const coverFile = decode(coverBase64);
		const fileName = id + '.jpeg';

		const { error: uploadError, data } = await supabase.storage
			.from('covers')
			.upload(fileName, coverFile, { contentType: 'image/jpeg' });

		if (uploadError) throw uploadError;

		return data.path;
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
		<p>You can create public or private image polls for free.</p>
		<p>
			We'll give you 10 credits to get you started and you can earn more credits
			by sharing your polls.
		</p>

		<h2>Login/register</h2>
	</UserLogin>

	<UserEdit v-else-if="!profile.username">
		<h2>
			<label for="username">My choosername</label>
		</h2>
	</UserEdit>

	<form v-else :class="$style.form" @submit.prevent="submit">
		<section id="visibility">
			<Credits />

			<h2>Type of poll</h2>
			<p v-for="(value, key) in VISIBILITIES" :key="key">
				<label
					:title="
						profile.credits < value.credits
							? `Requires ${value.credits} credit`
							: ''
					"
				>
					<input
						v-model="data.visibility"
						type="radio"
						:value="key"
						:disabled="profile.credits < value.credits"
						required
					/>
					{{ value.name }}
					<span v-if="value.credits">
						({{ value.credits }} credit{{ value.credits === 1 ? '' : 's' }})
					</span>
					<small>
						{{ value.description }}
					</small>
				</label>
			</p>
		</section>

		<section id="images">
			<h2>Images</h2>
			<Upload
				:folder="profile?.username ?? '@'"
				:max="MAX_IMAGES"
				@uploaded="(urls) => (data.images = urls)"
			/>
		</section>

		<section id="title">
			<h2><label for="title">Title</label></h2>
			<input
				id="title"
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

		<section v-if="data.visibility !== 'private'" id="categories">
			<h2>Category</h2>
			<p v-for="(category, key) in CATEGORIES" :key="key">
				<label>
					<input
						v-model="data.category"
						type="radio"
						name="category"
						:value="key"
						required
					/>
					{{ category }}
				</label>
			</p>
		</section>

		<section v-if="!profile.subscriptions" id="subscriptions">
			<h2>My subscriptions</h2>
			<UserSubscriptions />
		</section>

		<footer>
			<button type="button" class="button" @click="data.showPreview = true">
				Continue &rarr;
			</button>

			<NewChoicePreview
				v-if="data.showPreview"
				:title="data.title"
				:username="profile.username"
				:validation-message="validationMessage"
				:close="closePreview"
				:heading="VISIBILITIES[data.visibility]?.name"
			>
				<template #card-images>
					<div ref="cardImagesElement" class="cardImages">
						<img
							v-for="(image, index) in data.images"
							:key="index"
							class="cardImage"
							:src="image.replace('h_800', 'h_210')"
							alt=""
							loading="lazy"
							height="315"
							width="315"
						/>
					</div>
				</template>

				<p v-if="data.visibility === 'private'">
					You will get a private link to share with people you trust.
				</p>

				<p>
					Voting will close
					{{ longDateText(dates.close) }}.
				</p>

				<p>
					Your results will be available until
					{{ shortDateText(dates.remove) }}.
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
						data.images.length > MAX_IMAGES ||
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
