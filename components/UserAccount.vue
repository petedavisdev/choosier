<script setup lang="ts">
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const data = reactive({
	loading: false,
});

async function signOut() {
	try {
		data.loading = true;
		const response = await supabase.auth.signOut();
		if (response.error) throw response.error;
	} catch (error: unknown) {
		if (error instanceof Error) alert(error.message);
	} finally {
		data.loading = false;
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
			<button type="submit" class="button" :disabled="data.loading">
				&larr; Log Out
			</button>
		</p>
	</form>
</template>
