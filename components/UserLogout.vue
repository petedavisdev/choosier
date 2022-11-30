<template>
	<aside>
		<p>
			Logged in with <strong>{{ user?.email }}</strong>
		</p>

		<button @click.prevent="signOut" class="button" :disabled="data.loading">
			Log Out
		</button>
	</aside>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const data = reactive({
	loading: false,
});

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
aside {
	margin-top: 5em;
}
</style>
