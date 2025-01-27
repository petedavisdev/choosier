<script setup lang="ts">
const supabase = useSupabaseClient<Database>();

const loading = ref(false);
const requested = ref(false);
const email = ref('');

async function request() {
	try {
		loading.value = true;
		const response = await supabase.auth.signInWithOtp({ email: email.value });

		if (response.error) throw response.error;

		requested.value = true;
	} catch (error: unknown) {
		alert((error as Error)?.message);
	} finally {
		loading.value = false;
	}
}

function retry() {
	requested.value = false;
	email.value = '';
}
</script>

<template>
	<section id="request">
		<UserLoginToken v-if="requested" :email="email" @retry="retry">
			<h1>Confirmation code</h1>
		</UserLoginToken>
		<form v-else :class="$style.form" @submit.prevent="request">
			<slot />

			<input
				v-model="email"
				type="email"
				placeholder="Email"
				title="Email"
				autocomplete="email"
				required
				:class="$style.control"
				data-cy="email"
			/>

			<footer>
				<button
					type="submit"
					class="button"
					:disabled="loading"
					:class="$style.control"
					data-cy="submit-email"
				>
					{{ loading ? 'Loading' : 'Send me a confirmation code &rarr;' }}
				</button>
			</footer>
		</form>
	</section>
</template>

<style module>
.form {
	width: 100%;
	max-width: 30em;
}

.control {
	width: 100%;
	margin-bottom: 2em;
}
</style>
