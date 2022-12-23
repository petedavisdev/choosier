<template>
	<section>
		<UserLoginToken v-if="data.requested" :email="data.email" :retry="retry">
			<h1>Confirmation code</h1>
		</UserLoginToken>
		<form v-else @submit.prevent="request" id="request">
			<slot />

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
					{{ data.loading ? 'Loading' : 'Send me a confirmation code &rarr;' }}
				</button>
			</footer>
		</form>
	</section>
</template>

<script setup lang="ts">
const { auth } = useSupabaseAuthClient();

const data = reactive({
	loading: false,
	requested: false,
	email: '',
	token: '',
});

async function request() {
	try {
		data.loading = true;
		const response = await auth.signInWithOtp({ email: data.email });

		if (response.error) throw response.error;

		data.requested = true;
	} catch (error: any) {
		alert(error.error_description || error.message);
	} finally {
		data.loading = false;
	}
}

function retry() {
	data.requested = false;
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
