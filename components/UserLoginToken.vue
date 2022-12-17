<template>
	<form @submit.prevent="verify" id="verify">
		<h1>
			<label for="token">Confirmation code</label>
		</h1>

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

		<button type="submit" class="button token" :disabled="data.loading">
			{{ data.loading ? 'Loading' : 'Enter &rarr;' }}
		</button>
		<br />
		<p>
			Check your inbox (or maybe your spam folder)
			<br />
			If you don't get an email in a couple of minutes,
			<NuxtLink to="#request" @click="retry">try again</NuxtLink>.
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

		profile.getProfile();

		if (props.choiceId) {
			router.push('/result' + props.choiceId);
		} else if (profile.username) {
			router.push('/@' + profile.username);
		}
	} catch (error: any) {
		alert(error.error_description || error.message);
	} finally {
		data.loading = false;
	}
}
</script>
