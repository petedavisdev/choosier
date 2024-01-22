<script setup lang="ts">
const { profile } = useProfile();
const supabase = useSupabaseClient<Database>();

const props = defineProps<{
	id: number;
	image: string;
}>();

const data = reactive({
	loading: false,
	requested: false,
	email: '',
});

async function vote(userId: string) {
	try {
		data.loading = true;

		const response = await supabase.from('votes').upsert({
			user_id: userId,
			choice_id: props.id,
			image_urls: [props.image],
			updated_at: new Date().toISOString(),
		});

		if (response.error) throw response.error;

		if (profile.value) {
			if (!profile.value?.firstVote) {
				const profileResponse = await supabase
					.from('profiles')
					.update({ first_vote: props.id })
					.eq('user_id', profile.value.userId);

				if (profileResponse.error) throw profileResponse.error;
			}

			profile.value.votes = [...profile.value.votes, { choice_id: props.id }];

			navigateTo(PATHS.results + props.id);
		}
	} catch (error: any) {
		console.warn(error.message);
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

		return response.data.user_id;
	} catch (error: any) {
		alert(error.message);
	}
}

async function request() {
	try {
		data.loading = true;
		const response = await supabase.auth.signInWithOtp({ email: data.email });

		if (response.error) throw response.error;

		const userId = await getUserId();

		if (!userId) throw 'Unable to get user id';

		await vote(userId);

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

<template>
	<section :class="$style.chosen">
		<img :src="props.image" alt="" :class="$style.chosenImage" />
	</section>

	<section v-if="profile" :class="$style.confirm">
		<button type="button" class="button" @click="vote(profile.userId)">
			✓ Confirm my choice
		</button>
	</section>

	<section v-else-if="!data.requested" :class="$style.confirm">
		<header>
			<h1>Confirm your choice</h1>
			<p>To vote, please confirm you are human:</p>
		</header>

		<input
			v-model="data.email"
			type="email"
			placeholder="Email"
			title="Email"
			autocomplete="email"
			required
			:class="$style.email"
		/>

		<footer>
			<button type="button" class="button" @click.prevent="request">
				{{ data.loading ? 'Loading' : 'Send me a confirmation code &rarr;' }}
			</button>
		</footer>
	</section>

	<div v-else class="backdrop">
		<section class="box">
			<UserLoginToken
				:email="data.email"
				:retry="retry"
				:choice-id="props.id"
				:class="$style.confirm"
			>
				<h2>Confirmation code</h2>
			</UserLoginToken>
		</section>
	</div>
</template>

<style module>
.chosen,
.confirm {
	display: grid;
	place-content: center;
	min-height: 0;
	text-align: center;
}

.chosenImage {
	object-fit: contain;
	place-self: center;
	min-height: 0;
	max-width: 100%;
	max-height: 100%;
	line-height: 1;
	background-color: var(--lighter);
}

.email {
	width: 100%;
	margin-bottom: 1em;
}
</style>
