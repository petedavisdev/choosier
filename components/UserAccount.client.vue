<template>
	<form @submit.prevent="updateProfile">
		<p v-if="data.loading">Loading...</p>

		<h1>
			<label for="username">My choosername</label>
		</h1>

		<p>
			<input
				v-model="data.username"
				id="username"
				maxlength="15"
				@input="data.username = handle"
				required
			/>
		</p>

		<button type="submit" class="button" :disabled="data.loading">Save</button>
	</form>

	<footer>
		<p>
			Logged in with <strong>{{ user?.email }}</strong>
		</p>

		<button @click.prevent="signOut" class="button" :disabled="data.loading">
			Log Out
		</button>
	</footer>
</template>

<script setup lang="ts">
import { rand } from '@vueuse/shared';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const randomNumber = 100 + Math.floor(Math.random() * 900);

const data = reactive({
	loading: true,
	username: '',
});

const handle = computed(() =>
	data.username.toLowerCase().replace(/[^a-z0-9-_]/g, '')
);

const response = await supabase
	.from('profiles')
	.select(`username`)
	.eq('id', user.value?.id)
	.single();

if (response.data) {
	data.username = response.data.username || 'chooser' + randomNumber;
	data.loading = false;
}

async function updateProfile() {
	try {
		data.loading = true;

		const updates = {
			id: user.value?.id,
			username: data.username,
			updated_at: new Date(),
		};

		// @ts-ignore: Unreachable code error
		let { error } = await supabase.from('profiles').upsert(updates, {
			returning: 'minimal',
		});

		if (error) throw error;

		router.push('/@' + data.username);
	} catch (error: any) {
		alert(error.message);
	} finally {
		data.loading = false;
	}
}

async function signOut() {
	try {
		data.loading = true;
		let { error } = await supabase.auth.signOut();
		if (error) throw error.message;
		user.value = null;
	} catch (error) {
		alert(error);
	} finally {
		data.loading = false;
	}
}
</script>

<style scoped>
footer {
	margin-top: 5em;
}
</style>
