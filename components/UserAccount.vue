<template>
	<form @submit.prevent="signOut">
		<Credits />
		<p>
			It is free to create choices, but you can use credits for bonus features.
		</p>

		<LinkTo to="/new" class="button">+ New choice</LinkTo>

		<p>
			Logged in with <strong>{{ user?.email }}</strong>
		</p>

		<p>
			<button type="submit" class="button" :disabled="data.loading">
				&rarr; Log Out
			</button>
		</p>
	</form>
</template>

<script setup lang="ts">
const { auth } = useSupabaseAuthClient();
const user = useSupabaseUser();
const profile = useProfile();

const data = reactive({
	loading: false,
});

async function signOut() {
	try {
		data.loading = true;
		const response = await auth.signOut();
		if (response.error) throw response.error;
		user.value = null;
		profile.reset();
	} catch (error: any) {
		alert(error.message);
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
