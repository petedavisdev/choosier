<script setup lang="ts">
const supabase = useSupabaseClient<Database>();

const props = defineProps<{
	email: string;
	retry: () => void;
	choiceId?: number;
}>();

const data = reactive({
	loading: false,
	token: '',
});

async function verify() {
	try {
		data.loading = true;

		const loginResponse = await supabase.auth.verifyOtp({
			email: props.email,
			token: data.token,
			type: 'magiclink',
		});

		if (loginResponse.error) {
			const signupResponse = await supabase.auth.verifyOtp({
				email: props.email,
				token: data.token,
				type: 'signup',
			});

			if (signupResponse.error) throw signupResponse.error;
		}

		if (props.choiceId) {
			navigateTo(PATHS.results + props.choiceId);
		}
	} catch (error: unknown) {
		if (error instanceof Error) alert(error.message);
	} finally {
		data.loading = false;
	}
}
</script>

<template>
	<form id="verify" @submit.prevent="verify">
		<slot />
		<p>
			We sent a code to
			<br />
			<strong>{{ props.email }}</strong>
			<br />
			If you don't get it in a few minutes,
			<LinkTo to="#request" :class="$style.retry" @click="retry"
				>try again</LinkTo
			>.
		</p>

		<p>
			<input
				id="token"
				v-model="data.token"
				type="text"
				:class="$style.token"
				inputmode="numeric"
				pattern="[0-9]+"
				min-length="6"
				max-length="6"
				title="6 digit code"
				required
			/>
		</p>
		<p>
			<button type="submit" class="button token" :disabled="data.loading">
				{{ data.loading ? 'Loading' : 'Enter &rarr;' }}
			</button>
		</p>
	</form>
</template>

<style module>
.token {
	width: 7.5rem;
	display: inline-block;
	margin-bottom: -1rem;
	padding-bottom: 0.5rem;
	padding-top: 0.7rem;
	font-size: 1.5em;
}

.retry {
	text-decoration: underline;
}
</style>
