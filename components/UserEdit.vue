<script setup lang="ts">
const props = defineProps<{
	showWebsite?: boolean;
}>();

const supabase = useSupabaseClient<Database>();
const { profile } = useProfile();
const route = useRoute();

const data = reactive({
	loading: false,
	username: profile.value?.username,
	website: profile.value?.website,
});

const cleanUsername = computed(() =>
	data.username?.toLowerCase().replace(/[^a-z0-9-_]/g, '')
);

const cleanWebsite = computed(() => {
	let url = data.website?.toLowerCase() || '';

	if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
		url = 'https://' + url;
	}

	return url;
});

async function updateProfile() {
	if (profile.value && cleanUsername.value) {
		try {
			data.loading = true;

			const updates = {
				user_id: profile.value?.userId,
				username: cleanUsername.value,
				updated_at: new Date().toISOString(),
				website: cleanWebsite.value,
				first_vote:
					profile.value?.firstVote || profile.value?.votes[0]?.choice_id || 0,
			};

			const response = await supabase
				.from('profiles')
				.update(updates)
				.eq('user_id', profile.value.userId);

			if (response.error) throw response.error;

			profile.value.username = updates.username;
			profile.value.website = updates.website;
			profile.value.firstVote = updates.first_vote;

			if (route.path === PATHS.user && cleanUsername.value) {
				navigateTo(PATHS.user + cleanUsername.value);
			} else {
				location.reload();
			}
		} catch (error: unknown) {
			if (error instanceof Error) alert(error.message);
		} finally {
			data.loading = false;
		}
	}
}
</script>

<template>
	<form @submit.prevent="updateProfile">
		<slot />

		<p :class="$style.field">
			<input
				id="username"
				v-model="data.username"
				maxlength="15"
				required
				@input="data.username = cleanUsername"
			/>
			<small :class="$style.help">Up to 15 lowercase letters</small>
		</p>

		<template v-if="props.showWebsite">
			<label for="website">My website or instagram link</label>
			<p :class="$style.field">
				<input
					id="website"
					v-model="data.website"
					inputmode="url"
					autocomplete="url"
					:class="$style.website"
				/>
				<small
					v-if="data.website && data.website.length > 8"
					:class="$style.help"
				>
					Test your link:
					<LinkTo :to="cleanWebsite" target="_blank">{{ cleanWebsite }}</LinkTo>
				</small>
				<small v-else :class="$style.help">Optional</small>
			</p>
		</template>

		<button type="submit" class="button" :disabled="data.loading">
			{{ data.loading ? 'Saving...' : '✓ Save' }}
		</button>
	</form>
</template>

<style module>
.field {
	margin-top: 0;
	margin-bottom: 2rem;
}

.help {
	display: block;
}

.website {
	width: 100%;
	max-width: 30em;
}
</style>
