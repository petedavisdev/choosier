<script setup lang="ts">
const supabase = useSupabaseClient<Database>();

const emit = defineEmits<{ retry: []; verified: [userId: string] }>();

const props = defineProps<{
	email: string;
	choiceId?: number;
}>();

const loading = ref(false);
const token = ref('');
const isTokenBad = ref(false);

async function verify() {
	try {
		loading.value = true;
		let userId: string;

		const loginResponse = await supabase.auth.verifyOtp({
			email: props.email,
			token: token.value,
			type: 'magiclink',
		});

		userId = loginResponse.data.user?.id ?? '';

		if (!userId) {
			const signupResponse = await supabase.auth.verifyOtp({
				email: props.email,
				token: token.value,
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
		if ((error as { code: string }).code === 'otp_expired') {
			return (isTokenBad.value = true);
		}

		alert((error as Error)?.message);
	} finally {
		loading.value = false;
	}
}

function handleEnterCode() {
	isTokenBad.value = false;
	token.value = '';
}
</script>

<template>
	<form id="verify" @submit.prevent="verify">
		<slot />
		<p>
			Code sent to
			<br />
			<strong>{{ props.email }}</strong>
			<br />
			Check your inbox. Check your spam.
			<br />
			If you don't have it, wait a minute and
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
				v-model="token"
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
				:disabled="loading"
				data-cy="submit-token"
			>
				{{ loading ? 'Loading' : 'Enter &rarr;' }}
			</button>
		</p>
	</form>

	<aside v-if="isTokenBad" class="backdrop">
		<div class="box center">
			<p>
				Code <strong>{{ token }}</strong> is incorrect or has expired.
			</p>
			<p>
				<button
					type="button"
					class="button"
					data-cy="enter-correct-code"
					@click="handleEnterCode"
				>
					Enter correct code
				</button>
			</p>
			<LinkTo
				to="#request"
				class="button"
				data-cy="request-new-code"
				@click="emit('retry')"
			>
				Request a new code</LinkTo
			>
		</div>
	</aside>
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
