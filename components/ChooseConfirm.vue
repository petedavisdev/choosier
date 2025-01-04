<script setup lang="ts">
const { profile } = useProfile();
const supabase = useSupabaseClient<Database>();

const props = defineProps<{
	id: number;
	vote1: string;
	vote2?: string;
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
			image_urls: props.vote2 ? [props.vote1, props.vote2] : [props.vote1],
			updated_at: new Date().toISOString(),
		});

		if (response.error) throw response.error;

		if (profile.value) {
			profile.value.votes = [...profile.value.votes, { choice_id: props.id }];

			navigateTo(PATHS.results + props.id);
		}
	} catch (error: unknown) {
		alert((error as Error)?.message);
	} finally {
		data.loading = false;
	}
}

async function request() {
	try {
		data.loading = true;
		const response = await supabase.auth.signInWithOtp({ email: data.email });

		if (response.error) throw response.error;

		data.requested = true;
	} catch (error: unknown) {
		alert((error as Error)?.message);
	} finally {
		data.loading = false;
	}
}

function retry() {
	data.requested = false;
	data.email = '';
}
</script>

<template>
	<div>
		<section :class="$style.chosen">
			<div :class="$style.chosen1">
				<img
					:src="props.vote1"
					alt=""
					:class="$style.chosenImage"
					data-cy="chosen-image"
				/>
				<strong v-if="props.vote2" :class="$style.chosenNumber">#1</strong>
			</div>

			<span v-if="props.vote2" :class="$style.chosen2">
				<img
					:src="props.vote2"
					alt=""
					:class="$style.chosenImage"
					data-cy="chosen-image"
				/>
				<strong :class="$style.chosenNumber">#2</strong>
			</span>
		</section>

		<section v-if="profile" :class="$style.confirm">
			<button type="button" class="button" @click="vote(profile.userId)">
				✓ Confirm my {{ props.vote2 ? 'top 2' : 'choice' }} &rarr;
			</button>
		</section>

		<form
			v-else-if="!data.requested"
			:class="$style.confirm"
			@submit.prevent="request"
		>
			<header>
				<h1>Vote for your {{ props.vote2 ? 'top 2' : 'choice' }}</h1>
				<p>Please confirm you are human</p>
			</header>

			<input
				v-model="data.email"
				type="email"
				placeholder="Email"
				title="Email"
				autocomplete="email"
				required
				:class="$style.email"
				data-cy="email"
			/>

			<footer>
				<button
					type="submit"
					class="button"
					:disabled="data.loading"
					data-cy="submit-email"
				>
					{{
						data.loading ? 'Loading...' : 'Send me a confirmation code &rarr;'
					}}
				</button>
			</footer>

			<p><small>Your email will not be shared with anyone</small></p>
		</form>

		<aside v-else class="backdrop">
			<section class="box">
				<UserLoginToken
					:email="data.email"
					:choice-id="props.id"
					:class="$style.confirm"
					@retry="retry"
					@verified="(userId) => vote(userId)"
				>
					<h2>Confirmation code</h2>
				</UserLoginToken>
			</section>
		</aside>
	</div>
</template>

<style module>
.confirm,
.chosen {
	display: grid;
	place-content: center;
	min-height: 0;
	text-align: center;
}

.chosen {
	grid-auto-flow: column;
	grid-gap: 0.5em;
}

.chosen1,
.chosen2 {
	display: grid;
	place-content: center;
	min-height: 0;
}

.chosen2 {
	transform: scale(0.75);
}

.chosenImage {
	width: 100%;
	min-height: 0;
	max-height: 100%;
	object-fit: contain;
	line-height: 1;
}

.chosenNumber {
	position: absolute;
	top: -0.6rem;
	right: -0.8rem;
	font-size: 4em;
	color: var(--lightest);
	-webkit-text-stroke: 2px var(--dark);
}

.email {
	width: 100%;
	margin-bottom: 1em;
}
</style>
