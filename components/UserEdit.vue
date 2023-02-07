<template>
	<form @submit.prevent="updateProfile">
		<slot />

		<p class="field">
			<input
				v-model="data.username"
				id="username"
				maxlength="15"
				@input="data.username = cleanUsername"
				required
			/>
			<small>Up to 15 lowercase letters</small>
		</p>

		<template v-if="props.showWebsite">
			<label for="website">My website or instagram link</label>
			<p class="field">
				<input
					v-model="data.website"
					id="website"
					inputmode="url"
					autocomplete="url"
				/>
				<small v-if="data.website?.length > 8">
					Test your link:
					<LinkTo :to="cleanWebsite" target="_blank">{{ cleanWebsite }}</LinkTo>
				</small>
				<small v-else>Optional</small>
			</p>
		</template>

		<button type="submit" class="button" :disabled="data.loading">
			{{ data.loading ? 'Saving...' : '✓ Save' }}
		</button>
	</form>
</template>

<script setup lang="ts">
const props = defineProps<{
	showWebsite?: boolean;
}>();

const supabase = useSupabaseClient();
const profile = useProfile();
const router = useRouter();
const route = useRoute();

const data = reactive({
	loading: false,
	username: profile.username.value,
	website: profile.website.value,
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
	try {
		data.loading = true;

		const updates = {
			user_id: profile.userId.value,
			username: cleanUsername.value,
			updated_at: new Date(),
			website: cleanWebsite.value,
			first_vote:
				profile.firstVote.value || profile.votes.value[0]?.choice_id || 0,
		};

		// @ts-ignore: Unreachable code error
		const response = await supabase.from('profiles').upsert(updates, {
			returning: 'minimal',
		});

		if (response.error) throw response.error;

		profile.username.value = updates.username;
		profile.website.value = updates.website;
		profile.firstVote.value = updates.first_vote;

		if (route.path === '/account' && cleanUsername.value) {
			router.push('/@' + cleanUsername.value);
		} else {
			location.reload();
		}
	} catch (error: any) {
		alert(error.message);
	} finally {
		data.loading = false;
	}
}
</script>

<style scoped>
small {
	display: block;
}

.field {
	margin-top: 0;
	margin-bottom: 2rem;
}

#website {
	width: 100%;
	max-width: 30em;
}
</style>
