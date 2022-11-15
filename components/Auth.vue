<template>
	<form @submit.prevent="handleLogin">
		<h1>Log in</h1>

		<input
			type="email"
			placeholder="Email"
			v-model="data.email"
			title="Email"
		/>

		<button type="submit" class="button" :disabled="data.loading">
			{{ data.loading ? 'Loading' : 'Send me a magic link' }}
		</button>
	</form>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const data = reactive({
	loading: false,
	email: '',
});

async function handleLogin() {
	try {
		data.loading = true;
		const { error } = await supabase.auth.signInWithOtp({ email: data.email });
		if (error) throw error;
		alert('Check your email for the login link!');
	} catch (error: any) {
		alert(error.error_description || error.message);
	} finally {
		data.loading = false;
	}
}
</script>

<style scoped>
form {
	max-width: 24em;
}

input {
	display: block;
	width: 100%;
	margin-bottom: 1em;
}
</style>
