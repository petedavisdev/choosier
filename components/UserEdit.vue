<template>
	<form @submit.prevent="updateProfile">
		<h1>
			<label for="username">My choosername</label>
		</h1>

		<p>
			<input
				v-model="data.username"
				id="username"
				maxlength="15"
				@input="data.username = cleanUsername"
				required
			/>
			<small>Up to 15 lowercase letters</small>
		</p>

		<p v-if="data.saving">Saving...</p>
		<button type="submit" class="button" :disabled="data.saving">Save</button>
	</form>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const profile = useProfile();
const router = useRouter();
const route = useRoute();

const data = reactive({
	saving: false,
	username: profile.username.value,
});

const cleanUsername = computed(() =>
	data.username.toLowerCase().replace(/[^a-z0-9-_]/g, '')
);

async function updateProfile() {
	try {
		data.saving = true;

		const updates = {
			user_id: user.value?.id,
			username: data.username,
			updated_at: new Date(),
		};

		// @ts-ignore: Unreachable code error
		const response = await supabase.from('profiles').upsert(updates, {
			returning: 'minimal',
		});

		if (response.error) throw response.error;

		profile.getProfile();

		if (route.path === '/@') {
			router.push('/@' + data.username);
		}
	} catch (error: any) {
		alert(error.message);
	} finally {
		data.saving = false;
	}
}
</script>

<style scoped>
small {
	display: block;
}
</style>
