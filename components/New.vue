<script setup lang="ts">
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

const cardImagesElement = ref<HTMLElement>();

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
			? `You have more than the allowed ${MAX_IMAGES} images!`
			: !data.title
				? 'You need a title!'
				: !data.visibility
					? 'Choose visibility!'
					: !data.category && data.visibility !== 'private'
						? 'Choose a category!'
						: '';
});

async function submit() {
	if (
		profile.value &&
		data.images.length >= MIN_IMAGES &&
		data.images.length <= MAX_IMAGES
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
						voting_system: data.images.length > 2 ? '2' : '1',
					},
				])
				.select();

			if (choicesResponse.error || !choicesResponse.data[0]) {
				throw choicesResponse.error;
			}

			const newChoiceId = choicesResponse.data[0].id;

			const coverPath = await uploadCover(newChoiceId);

			console.log('coverPath', coverPath);

			if (coverPath) {
				console.log('coverUrl', useCover(newChoiceId));
				navigateTo(PATHS.new + newChoiceId);
			}
		} catch (error: unknown) {
			alert((error as Error)?.message);
		} finally {
			data.loading = false;
		}
	}
}

async function uploadCover(id: number) {
	try {
		const coverUrl = await toImage(5 / 3, 0.7, cardImagesElement.value);

		if (!coverUrl) return;

		const coverBase64 = coverUrl.replace('data:image/jpeg;base64,', '');
		const coverFile = decode(coverBase64);
		const fileName = id + '.jpeg';

		const { error: uploadError, data } = await supabase.storage
			.from('covers')
			.upload(fileName, coverFile, { contentType: 'image/jpeg' });

		if (uploadError) throw uploadError;

		return data.path;
	} catch (error: unknown) {
		alert((error as Error)?.message);
	}
}
</script>

<template>
	<form :class="$style.form" @submit.prevent="submit">
		<section id="visibility">
			<p
				v-for="(visibility, visibilityKey) in VISIBILITIES"
				:key="visibilityKey"
			>
				<label>
					<input
						v-model="data.visibility"
						type="radio"
						:value="visibilityKey"
						required
					/>

					<span>{{ visibility.name }}</span>

					<span>
						(<strong> {{ visibility.price }} </strong>)
					</span>

					<small>{{ visibility.description }}</small>
				</label>
			</p>

			<small>(You can close voting early if you like)</small>
		</section>

		<template v-if="profile?.username">
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
				<p :class="$style.help">Help {{ profile.username }} choose:</p>
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
						: ''
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

			<section v-if="!profile?.subscriptions" id="subscriptions">
				<h2>My subscriptions</h2>
				<UserSubscriptions />
			</section>

			<footer>
				<button type="button" class="button" @click="data.showPreview = true">
					Continue &rarr;
				</button>
			</footer>

			<NewPreview
				v-if="data.showPreview"
				:title="data.title"
				:username="profile?.username"
				:validation-message="validationMessage"
				:heading="VISIBILITIES[data.visibility]?.name"
				@close="data.showPreview = false"
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

				<button
					type="submit"
					class="button"
					:disabled="
						data.images.length < MIN_IMAGES ||
						data.images.length > MAX_IMAGES ||
						data.loading
					"
				>
					✓ Save and publish
				</button>
			</NewPreview>
		</template>
	</form>

	<UserLogin v-if="!profile">
		<h2>Login/register</h2>
	</UserLogin>

	<UserEdit v-else-if="!profile.username">
		<h2>
			<label for="username">My choosername</label>
		</h2>
	</UserEdit>
</template>

<style module>
.form {
	display: grid;
	gap: 1em;
}

.titleInput {
	width: 100%;
}

.help {
	margin: -1em 0 0.25em;
}
</style>
