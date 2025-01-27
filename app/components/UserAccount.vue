<script setup lang="ts">
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const loading = ref(false);

async function signOut() {
	try {
		loading.value = true;
		const response = await supabase.auth.signOut();
		if (response.error) throw response.error;
	} catch (error: unknown) {
		alert((error as Error)?.message);
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<form @submit.prevent="signOut">
		<p>
			Logged in with <strong>{{ user?.email }}</strong>
		</p>

		<small>Your email address is never shared with anyone.</small>

		<p>
			<button type="submit" class="button" :disabled="loading">
				&larr; Log Out
			</button>
		</p>
	</form>
</template>
