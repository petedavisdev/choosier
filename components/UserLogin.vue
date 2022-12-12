<template>
	<section class="backdrop">
		<form v-if="!data.submitted" @submit.prevent="login" class="box cen">
			<h1>Login/Register</h1>
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

		<form v-else @submit.prevent="verify">
			<h1>Confirmation code</h1>
			<p>Check your inbox or maybe your spam folder.</p>
			<label>
				One-time confirmation code
				<input v-model="data.code" id="code" inputmode="numeric" />
			</label>
			<button type="submit" class="button" :disabled="data.loading">
				{{ data.loading ? 'Loading' : 'Enter &rarr;' }}
			</button>
		</form>
	</section>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const data = reactive({
	loading: false,
	submitted: false,
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
		data.submitted = true;
	} catch (error: any) {
		alert(error.error_description || error.message);
	} finally {
		data.loading = false;
	}
}

async function verify() {
	try {
		data.loading = true;
		const { error } = await supabase.auth.verifyOtp(data.code);
		if (error) throw error;
	} catch (error: any) {
		alert(error.error_description || error.message);
	} finally {
		data.loading = false;
	}
}
</script>

<style scoped>
form {
	min-width: 25em;
	max-width: 35em;
}

input,
button {
	width: 100%;
	margin-bottom: 2em;
}
</style>
