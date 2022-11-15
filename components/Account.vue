<template>
	<form @submit.prevent="updateProfile">
		<p>
			You are logged in as <strong>{{ user.email }}</strong>
		</p>
		<p>
			<label for="username">Choosername</label>
			<input id="username" type="text" v-model="data.username" />
		</p>
		<p>
			<label for="website">Website</label>
			<input id="website" type="website" v-model="data.website" />
		</p>

		<button type="submit" class="button" :disabled="data.loading">
			{{ data.loading ? 'Loading ...' : 'Update' }}
		</button>

		<div>
			<button @click="signOut" class="button" :disabled="data.loading">
				Sign Out
			</button>
		</div>
	</form>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const data = reactive({
	loading: true,
	username: '',
	website: '',
	avatar_path: '',
});

let response = await supabase
	.from('profiles')
	.select(`username, website, avatar_url`)
	.eq('id', user.value.id)
	.single();

if (response.data) {
	data.username = response.data.username;
	data.website = response.data.website;
	data.avatar_url = response.data.avatar_url;
	data.loading = false;
}

async function updateProfile() {
	try {
		data.loading = true;
		const user = useSupabaseUser();
		const updates = {
			id: user.value.id,
			username: data.username.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
			website: data.website,
			avatar_url: data.avatar_path,
			updated_at: new Date(),
		};
		let { error } = await supabase.from('profiles').upsert(updates, {
			returning: 'minimal', // Don't return the value after inserting
		});
		if (error) throw error;
	} catch (error) {
		alert(error.message);
	} finally {
		data.loading = false;
	}
}

async function signOut() {
	try {
		data.loading = true;
		let { error } = await supabase.auth.signOut();
		if (error) throw error;
		user.value = null;
	} catch (error) {
		alert(error.message);
	} finally {
		data.loading = false;
	}
}
</script>
