<template>
	<form @submit.prevent="verify" id="verify">
		<slot />
		<p>
			We sent a code to
			<br />
			<strong>{{ props.email }}</strong>
			<br />
			If you don't get it soon,
			<LinkTo to="#request" @click="retry" class="retry">try again</LinkTo>.
		</p>

		<p>
			<input
				v-model="data.token"
				id="token"
				class="token"
				inputmode="numeric"
				min-length="6"
				max-length="6"
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

<script setup lang="ts">
const { auth } = useSupabaseAuthClient();
const router = useRouter();
const profile = useProfile();

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

		const { error } = await auth.verifyOtp({
			email: props.email,
			token: data.token,
			type: 'magiclink',
		});

		if (error) throw error;

		const { username } = await profile.get();

		if (props.choiceId) {
			router.push('/result' + props.choiceId);
		} else if (username.value) {
			router.push('/@' + username.value);
		}
	} catch (error: any) {
		alert(error.error_description || error.message);
	} finally {
		data.loading = false;
	}
}
</script>

<style scoped>
.token {
	width: 7.5rem;
	display: inline-block;
	margin-bottom: -1rem;
	padding-bottom: 0.5rem;
	padding-top: 0.7rem;
}

input.token {
	font-size: 1.5em;
}

.retry {
	text-decoration: underline;
}
</style>
