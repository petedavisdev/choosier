<script setup lang="ts">
const { auth } = useSupabaseAuthClient();
const profile = useProfile();

const data = reactive({
	loading: false,
});

async function signOut() {
	try {
		data.loading = true;
		const response = await auth.signOut();
		if (response.error) throw response.error;
	} catch (error: any) {
		alert(error.message);
	} finally {
		data.loading = false;
	}
}
</script>

<template>
	<form @submit.prevent="signOut">
		<Credits />

		<LinkTo to="/new" class="button">+ New choice</LinkTo>

		<p>
			Logged in with <strong>{{ profile.email.value }}</strong>
		</p>

		<p>
			<button type="submit" class="button" :disabled="data.loading">
				&rarr; Log Out
			</button>
		</p>
	</form>
</template>
