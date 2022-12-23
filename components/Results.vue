<template>
	<Head>
		<Title>Choosier. Results for @{{ choice.username }}</Title>
		<Meta
			name="description"
			:content="`Results for @${choice.username} choosing ${choice.title}`"
		/>
	</Head>

	<div v-if="!user">
		<h1>Only registered choosers can see results</h1>
		<p>Check your email for a login link.</p>
		<p>
			If you haven't received one,
			<NuxtLink to="/account">click here</NuxtLink>.
		</p>
	</div>

	<div v-else-if="!userVote">
		<h1>Choose first, then see the results</h1>
		<Card :id="props.id" class="card" />
	</div>

	<div v-else-if="!profile.username.value">
		<p>You need a choosername to show on the results</p>
		<UserEdit />
	</div>

	<div v-else>
		<h1>
			<small>
				You helped
				<NuxtLink :to="'/@' + choice.username">
					@{{ choice.username }}
				</NuxtLink>
				choose
			</small>
			{{ choice.title }}
		</h1>

		<p>Here are the results so far</p>

		<article v-for="(result, index) in results" :key="index">
			<img
				:src="result.image"
				alt=""
				:title="result.image.split('/').pop()?.replace('.webp', '')"
			/>
			<div
				class="bar"
				:style="{
					width: (100 * result.voters.length) / mostVotes + '%',
				}"
			>
				<strong class="count">{{ result.voters.length }}</strong>
				<div class="voters">
					<small v-for="voter in result.voters" :key="voter">
						<NuxtLink :to="'/@' + voter">
							<Component
								:is="voter === profile.username.value ? 'strong' : 'span'"
							>
								@{{ voter }}
							</Component>
						</NuxtLink>
						{{ ' ' }}
					</small>
				</div>
			</div>
		</article>

		<footer>
			<h2>Share to get more votes</h2>
			<Share :id="props.id" />

			<p>
				<NuxtLink to="/" :target="linkTarget"
					>Choosier homepage &rarr;</NuxtLink
				>
			</p>
		</footer>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const choice = await useChoice(props.id);
const profile = useProfile();
const linkTarget = process.browser && window.frameElement ? '_parent' : '_self';

type Vote = {
	user_id: string;
	image_url: string;
	profiles: {
		username: string;
	};
};

const data = reactive({
	loading: true,
	votes: [] as Vote[],
});

const results = computed(() => {
	return choice.images
		.map((image: string) => {
			return {
				image,
				voters: data.votes
					.filter((vote) => image === vote.image_url)
					.map((vote) => vote.profiles.username)
					.filter((vote) => vote)
					.sort(function (a, b) {
						return a === profile.username.value
							? -1
							: b === profile.username.value
							? 1
							: 0;
					}),
			};
		})
		.sort((a, b) => b.voters.length - a.voters.length);
});

const mostVotes = computed(() => results.value[0].voters.length);

const userVote = computed(
	() => data.votes.find((vote) => vote.user_id === user.value?.id)?.image_url
);

try {
	const response = await supabase
		.from('votes')
		.select(
			`
			user_id,
			image_url,
			profiles(username)
			`
		)
		.eq('choice_id', props.id);

	if (response.error) throw response.error;

	data.votes = response.data as Vote[];
} catch (error) {
	console.error(error);
} finally {
	data.loading = false;
}
</script>

<style scoped>
article {
	display: grid;
	grid-template-columns: max-content 1fr;
	margin-top: 0.5em;
}

.bar {
	text-align: left;
	background-color: var(--mid);
}

.count {
	font-size: 2em;
	padding: 0.1em;
}

small {
	display: block;
	font-size: 1rem;
}

.voters {
	padding: 0.2em 0.5em;
	white-space: nowrap;
}

.voters small {
	display: inline;
}

img {
	width: 100%;
	max-width: 20vmin;
	height: auto;
}

.card {
	max-width: 24em;
}
</style>
