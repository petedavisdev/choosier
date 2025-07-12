<script setup lang="ts">
import { decode } from 'base64-arraybuffer';
import { IMAGE_LIMITS } from '~~/shared/utils/constants';

const supabase = useSupabaseClient<Database>();
const { profile } = useProfile();

const loading = ref(false);
const title = ref('');
const images = ref<string[]>([]);
const category = ref('');
const visibility = ref<'public' | 'private'>('public');
const showPreview = ref(false);

const cardImagesElement = ref<HTMLElement>();

function getCloseAt() {
	const date = new Date();
	date.setHours(date.getHours() + TIMES.closeHours);
	return date.toISOString();
}

function getRemoveAt() {
	const date = new Date();
	date.setDate(date.getDate() + TIMES.removeDays);
	return date.toISOString();
}

const validationMessage = computed(() => {
	return images.value.length < IMAGE_LIMITS.min
		? `You need at least ${IMAGE_LIMITS.min} images!`
		: images.value.length > IMAGE_LIMITS.max
			? `You have more than the allowed ${IMAGE_LIMITS.max} images!`
			: !title.value
				? 'You need a title!'
				: !visibility.value
					? 'Choose visibility!'
					: !category.value && visibility.value !== 'private'
						? 'Choose a category!'
						: '';
});

async function submit() {
	if (
		profile.value &&
		images.value.length >= IMAGE_LIMITS.min &&
		images.value.length <= IMAGE_LIMITS.max
	) {
		try {
			loading.value = true;

			const choicesResponse = await supabase
				.from('choices')
				.insert([
					{
						title: title.value,
						image_urls: images.value,
						user_id: profile.value?.userId,
						visibility: visibility.value,
						category: category.value,
						close_at: getCloseAt(),
						remove_at: getRemoveAt(),
						voting_system: images.value.length > 2 ? '2' : '1',
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
			loading.value = false;
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
				v-for="(visibilityInfo, visibilityKey) in VISIBILITIES"
				:key="visibilityKey"
			>
				<label>
					<input
						v-model="visibility"
						type="radio"
						:value="visibilityKey"
						required
						:data-cy="`visibility-${visibilityKey}`"
					/>
					<strong>{{ visibilityInfo.name }}</strong>

					&mdash;
					<small>{{ visibilityInfo.description }}</small>
				</label>
			</p>
		</section>

		<template v-if="profile?.username">
			<section id="images">
				<h2>Images</h2>
				<Upload
					:folder="profile.username ?? '@'"
					:max="IMAGE_LIMITS.max"
					@uploaded="(urls) => (images = urls)"
				/>
			</section>

			<section id="title">
				<h2><label for="title">Title</label></h2>
				<p :class="$style.help">Help {{ profile.username }} choose:</p>
				<input
					id="title"
					v-model="title"
					maxlength="25"
					required
					:class="$style.titleInput"
				/>
				<small>{{
					title.length > 15 ? `${25 - title.length} characters remaining` : ''
				}}</small>
			</section>

			<section v-if="visibility !== 'private'" id="categories">
				<h2>Category</h2>
				<p v-for="(categoryName, key) in CATEGORIES" :key="key">
					<label>
						<input
							v-model="category"
							type="radio"
							name="category"
							:value="key"
							required
							:data-cy="`category-${key}`"
						/>
						{{ categoryName }}
					</label>
				</p>
			</section>

			<section v-if="!profile?.subscriptions" id="subscriptions">
				<h2>My subscriptions</h2>
				<UserSubscriptions />
			</section>

			<footer>
				<button type="button" class="button" @click="showPreview = true">
					Continue &rarr;
				</button>
			</footer>

			<NewPreview
				v-if="showPreview"
				:title="title"
				:username="profile?.username"
				:validation-message="validationMessage"
				:heading="VISIBILITIES[visibility]?.name"
				:visibility="visibility"
				@close="showPreview = false"
			>
				<template #card-images>
					<div ref="cardImagesElement" class="cardImages">
						<img
							v-for="(image, index) in images"
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

				<p v-if="visibility === 'private'">
					You will get a private link to share with people you trust.
				</p>

				<p>Your first {{ TIMES.closeHours }} hours of voting are free!</p>

				<p>Need more time? It's cheap and easy to extend.</p>
				<button
					type="submit"
					class="button"
					:disabled="
						images.length < IMAGE_LIMITS.min ||
						images.length > IMAGE_LIMITS.max ||
						loading
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
