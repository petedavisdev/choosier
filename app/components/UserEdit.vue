<script setup lang="ts">
const props = defineProps<{
	showWebsite?: boolean;
}>();

const supabase = useSupabaseClient<Database>();
const { profile } = useProfile();
const route = useRoute();
const usernameInput = ref<HTMLInputElement | null>(null);

const data = reactive({
	loading: false,
	username: profile.value?.username,
	website: profile.value?.website,
	usernameTaken: false,
	saved: false,
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

function handleTakenUsername() {
	data.usernameTaken = false;
	usernameInput.value?.focus();
}

async function updateProfile() {
	if (profile.value && cleanUsername.value) {
		try {
			data.loading = true;

			const updates = {
				user_id: profile.value?.userId,
				username: cleanUsername.value,
				updated_at: new Date().toISOString(),
				website: cleanWebsite.value,
			};

			const response = await supabase
				.from('profiles')
				.update(updates)
				.eq('user_id', profile.value.userId);

			if (response.error) throw response.error;

			profile.value.username = updates.username;
			profile.value.website = updates.website;

			if (route.path === PATHS.user && cleanUsername.value) {
				data.saved = true;
			} else {
				location.reload();
			}
		} catch (error: unknown) {
			if ((error as { code: string }).code === '23505') {
				return (data.usernameTaken = true);
			}

			alert((error as Error)?.message);
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
				ref="usernameInput"
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

	<aside v-if="data.usernameTaken" class="backdrop">
		<div class="box center">
			<p>
				Sorry, <strong>{{ cleanUsername }}</strong> is taken
			</p>
			<button type="button" class="button" @click="handleTakenUsername">
				Try another choosername
			</button>
		</div>
	</aside>

	<aside v-if="data.saved" class="backdrop" @click.self="data.saved = false">
		<div class="box center">
			<button class="close" @click="data.saved = false"></button>
			<p>Changes saved</p>
			<LinkTo :to="`${PATHS.user}${cleanUsername}`" class="button">
				View profile &rarr;
			</LinkTo>
		</div>
	</aside>
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
