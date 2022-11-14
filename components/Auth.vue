<template>
	<form @submit.prevent="handleLogin">
		<h1>Log in</h1>
		<p>
			<input type="email" placeholder="Email" v-model="email" title="Email" />
		</p>
		<button type="submit" class="button" :disabled="loading">
			{{ loading ? 'Loading' : 'Send me a magic link' }}
		</button>
	</form>
</template>

<script setup>
const supabase = useSupabaseClient(),
	loading = ref(false),
	email = ref('');

async function handleLogin() {
	try {
		loading.value = true;
		const { error } = await supabase.auth.signInWithOtp({ email: email.value });
		if (error) throw error;
		alert('Check your email for the login link!');
	} catch (error) {
		alert(error.error_description || error.message);
	} finally {
		loading.value = false;
	}
}
</script>
