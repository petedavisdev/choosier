<template>
	<section class="backdrop">
		<form @submit.prevent="login" class="box cen">
			<h1>Login/Register</h1>

			<button type="button" @click="googleLogin" class="button">
				Log in with Google
			</button>

			<p>or</p>

			<input
				type="email"
				placeholder="Email"
				v-model="data.email"
				title="Email"
			/>

			<footer>
				<button type="submit" class="button" :disabled="data.loading">
					{{ data.loading ? 'Loading' : 'Send me a login link &rarr;' }}
				</button>
			</footer>

			<p><NuxtLink to="/">&larr; Home</NuxtLink></p>
		</form>
	</section>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const data = reactive({
	loading: false,
	email: '',
});

async function login() {
	try {
		data.loading = true;
		const { error } = await supabase.auth.signInWithOtp({
			email: data.email,
			options: { emailRedirectTo: 'https://choosier.app/account' },
		});
		if (error) throw error;
		alert('Check your email for the login link!');
	} catch (error: any) {
		alert(error.error_description || error.message);
	} finally {
		data.loading = false;
	}
}

async function googleLogin() {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
	});
}
</script>

<style scoped>
form {
	max-width: 24em;
}

input,
button {
	display: block;
	width: 100%;
	margin-bottom: 2em;
}
</style>
