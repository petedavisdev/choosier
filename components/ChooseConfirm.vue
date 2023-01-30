<template>
	<section class="chosen">
		<img :src="props.image" alt="" />
	</section>

	<section v-if="profile.userId.value" class="confirm">
		<button @click="vote()" type="button" class="button">
			✓ Confirm my choice
		</button>
	</section>

	<section v-else-if="!data.requested" class="confirm">
		<h1>Confirm your choice</h1>
		<p>To vote, please confirm you are human.</p>

		<input
			type="email"
			placeholder="Email"
			v-model="data.email"
			title="Email"
			autocomplete="email"
			required
		/>

		<footer>
			<button @click.prevent="request" type="button" class="button">
				{{ data.loading ? 'Loading' : 'Send me a confirmation code &rarr;' }}
			</button>
		</footer>
	</section>

	<div class="backdrop" v-else>
		<section class="box">
			<UserLoginToken
				:email="data.email"
				:retry="retry"
				:choice-id="props.id"
				class="confirm"
				><h2>Confirmation code</h2></UserLoginToken
			>
		</section>
	</div>
</template>

<script setup lang="ts">
const router = useRouter();
const profile = useProfile();
const supabase = useSupabaseClient();

const props = defineProps<{
	id: number;
	image: string;
}>();

const data = reactive({
	loading: false,
	requested: false,
	email: '',
	userId: '',
});

async function vote() {
	try {
		data.loading = true;

		const updates = {
			user_id: data.userId || profile.userId.value,
			choice_id: props.id,
			image_url: props.image,
			updated_at: new Date(),
		};

		// @ts-ignore: Unreachable code error
		const response = await supabase.from('votes').upsert(updates, {
			returning: 'minimal',
		});

		if (response.error) throw response.error;

		if (profile.userId.value) {
			if (!profile.firstVote.value) {
				const profileResponse = await supabase
					.from('profiles')
					// @ts-ignore: Unreachable code error
					.update({ first_vote: props.id })
					.eq('user_id', profile.userId.value);

				if (profileResponse.error) throw profileResponse.error;
			}

			router.push('/result' + props.id);
		}
		return true;
	} catch (error: any) {
		console.warn(error.message);
		return false;
	} finally {
		data.loading = false;
	}
}

async function getUserId() {
	try {
		const response = await supabase
			.from('profiles')
			.select('user_id')
			.eq('email', data.email)
			.single();

		if (response.error) throw response.error;

		data.userId = response.data.user_id;
		return true;
	} catch (error: any) {
		alert(error.message);
		return false;
	}
}

async function request() {
	try {
		data.loading = true;
		const response = await supabase.auth.signInWithOtp({ email: data.email });

		if (response.error) throw response.error;

		const hasId = await getUserId();

		if (!hasId) throw 'Unable to get user id';

		await vote();

		data.requested = true;
	} catch (error: any) {
		alert(error);
	} finally {
		data.loading = false;
	}
}

function retry() {
	data.requested = false;
}
</script>

<style scoped>
.button {
	margin-top: 1em;
}

.chosen,
.confirm {
	display: grid;
	place-content: center;
	min-height: 0;
	text-align: center;
}

.chosen img {
	object-fit: contain;
	place-self: center;
	min-height: 0;
	max-width: 100%;
	max-height: 100%;
	line-height: 1;
	background-color: var(--lighter);
}
</style>
