<script setup lang="ts">
const supabase = useSupabaseClient<Database>();

const data = reactive({
	loading: false,
	requested: false,
	email: '',
	token: '',
});

async function request() {
	try {
		data.loading = true;
		const response = await supabase.auth.signInWithOtp({ email: data.email });

		if (response.error) throw response.error;

		data.requested = true;
	} catch (error: unknown) {
		if (error instanceof Error) alert(error.message);
	} finally {
		data.loading = false;
	}
}

function retry() {
	data.requested = false;
}
</script>

<template>
	<section>
		<UserLoginToken v-if="data.requested" :email="data.email" :retry="retry">
			<h1>Confirmation code</h1>
		</UserLoginToken>
		<form v-else id="request" :class="$style.form" @submit.prevent="request">
			<slot />

			<input
				v-model="data.email"
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
					:disabled="data.loading"
					:class="$style.control"
					data-cy="submit-email"
				>
					{{ data.loading ? 'Loading' : 'Send me a confirmation code &rarr;' }}
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
