<script setup lang="ts">
const supabase = useSupabaseClient<Database>();

const emit = defineEmits<{ retry: []; verified: [userId: string] }>();

const props = defineProps<{
	email: string;
	choiceId?: number;
}>();

const data = reactive({
	loading: false,
	token: '',
});

async function verify() {
	try {
		data.loading = true;
		let userId: string;

		const loginResponse = await supabase.auth.verifyOtp({
			email: props.email,
			token: data.token,
			type: 'magiclink',
		});

		userId = loginResponse.data.user?.id ?? '';

		if (!userId) {
			const signupResponse = await supabase.auth.verifyOtp({
				email: props.email,
				token: data.token,
				type: 'signup',
			});

			if (signupResponse.data.user?.id) {
				emit('verified', signupResponse.data.user?.id);
				return;
			}

			userId = signupResponse.data.user?.id ?? '';

			if (signupResponse.error) throw signupResponse.error;
		}

		emit('verified', userId);
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
			<LinkTo
				to="#request"
				:class="$style.retry"
				data-cy="retry"
				@click="emit('retry')"
			>
				try again</LinkTo
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
				data-cy="token"
			/>
		</p>
		<p>
			<button
				type="submit"
				class="button token"
				:disabled="data.loading"
				data-cy="submit-token"
			>
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
