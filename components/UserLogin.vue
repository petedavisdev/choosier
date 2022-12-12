<template>
	<section class="backdrop">
		<form
			v-if="!data.requested"
			@submit.prevent="request"
			class="box cen"
			id="request"
		>
			<h1>Login/Register</h1>
			<input
				type="email"
				placeholder="Email"
				v-model="data.email"
				title="Email"
				autocomplete="email"
				required
			/>

			<footer>
				<button type="submit" class="button" :disabled="data.loading">
					{{ data.loading ? 'Loading' : 'Send me a login link &rarr;' }}
				</button>
			</footer>

			<p><NuxtLink to="/">&larr; Home</NuxtLink></p>
		</form>

		<form v-else @submit.prevent="verify" class="box cen" id="verify">
			<h1>
				<label for="token">Confirmation code</label>
			</h1>
			<input
				v-model="data.token"
				id="token"
				class="token"
				inputmode="numeric"
				min-length="6"
				max-length="6"
				required
			/>
			<br />
			<button type="submit" class="button token" :disabled="data.loading">
				{{ data.loading ? 'Loading' : 'Enter &rarr;' }}
			</button>

			<p>Check your inbox (or maybe your spam folder)</p>
			<p>
				If you don't get an email in a couple of minutes,
				<NuxtLink to="#request" @click="data.requested = false"
					>try again</NuxtLink
				>.
			</p>
		</form>
	</section>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const data = reactive({
	loading: false,
	requested: false,
	email: '',
	token: '',
});

async function request() {
	try {
		data.loading = true;
		const { error } = await supabase.auth.signInWithOtp({ email: data.email });

		if (error) throw error;

		data.requested = true;
	} catch (error: any) {
		alert(error.error_description || error.message);
	} finally {
		data.loading = false;
	}
}

async function verify() {
	try {
		data.loading = true;

		const { error } = await supabase.auth.verifyOtp({
			email: data.email,
			token: data.token,
			type: 'magiclink',
		});

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

.token {
	width: 9rem;
	text-align: center;
}
input.token {
	font-size: 1.5em;
	margin-bottom: 1em;
}
</style>
