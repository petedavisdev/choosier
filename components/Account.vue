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

<script setup lang="ts">
import { PostgrestError } from '@supabase/postgrest-js';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const data = reactive({
	loading: true,
	username: '',
	website: '',
	avatar_url: '',
});

let response = await supabase
	.from('profiles')
	.select(`username, website, avatar_url`)
	.eq('id', user.value?.id)
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
		const username = data.username.toLowerCase().replace(/[^a-z0-9-_]/g, '');

		const updates = {
			id: user.value?.id,
			username,
			website: data.website,
			avatar_url: data.avatar_url,
			updated_at: new Date(),
		};

		// @ts-ignore: Unreachable code error
		let { error } = await supabase.from('profiles').upsert(updates, {
			returning: 'minimal',
		});

		if (error) throw error;

		data.username = username;
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
