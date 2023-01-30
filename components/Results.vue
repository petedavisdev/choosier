<template>
	<Head>
		<Title>Choosier. Results for @{{ choice.username }}</Title>
		<Meta
			name="description"
			:content="`Results for @${choice.username} choosing ${choice.title}`"
		/>
	</Head>

	<template v-if="!profile.userId.value && !closed">
		<h1>Results</h1>
		<p>You need to vote and login to see the results so far...</p>
		<h2>Vote</h2>
		<List :filter="['id', props.id]" />
		<h2>Login</h2>
		<UserLogin />
	</template>

	<template v-else-if="!userVoted && !closed && !userCreated">
		<h1>Choose first, then see the results</h1>
		<List :filter="['id', props.id]" />
	</template>

	<div v-else-if="!profile.username.value && !closed">
		<UserEdit>
			<h1>My choosername</h1>
			<p>You need a choosername to show on the results page</p>
		</UserEdit>
	</div>

	<template v-else-if="!removed">
		<h1>
			<small>
				{{ userVoted ? 'You helped' : 'Help' }}
				<LinkTo :to="'/@' + choice.username"> @{{ choice.username }} </LinkTo>
				choose
			</small>
			{{ choice.title }}
		</h1>

		<template v-if="closed">
			<h2>Final results</h2>
			<p>Voting has closed. Results available until {{ removeText }}</p>
		</template>

		<h2 v-else>Results so far...</h2>

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
						<LinkTo :to="'/@' + voter">
							<Component
								:is="voter === profile.username.value ? 'strong' : 'span'"
							>
								@{{ voter }}
							</Component>
						</LinkTo>
						{{ ' ' }}
					</small>
				</div>
			</div>
		</article>

		<div class="grid">
			<aside v-if="firstTimeVoters" class="box welcome">
				<h2>Welcome to {{ firstTimeVoters.length }} first-time choosers!</h2>
				<p>
					<template v-for="{ username } in firstTimeVoters" :key="username">
						<LinkTo :to="'/@' + username"> @{{ username }}</LinkTo
						>{{ ' ' }}
					</template>
				</p>
				<strong>
					<LinkTo to="/credits">+{{ firstTimeVoters.length }} credits</LinkTo>
					for
					<LinkTo :to="'/@' + choice.username"> @{{ choice.username }} </LinkTo>
				</strong>
			</aside>

			<aside class="box">
				<template v-if="!closed">
					<h2>Share to get more votes</h2>
					<Share :id="props.id" />
				</template>
			</aside>
		</div>

		<footer>
			<h2>Latest choices...</h2>
			<List :filter="['', '']" open>No more choices available right now</List>

			<LinkTo to="/new" class="button">+ Make your own choice</LinkTo>
		</footer>
	</template>
</template>

<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const supabase = useSupabaseClient();
const choice = await useChoice(props.id);
const profile = useProfile();
const closed = new Date(choice.closeAt as string) < new Date();
const removed = new Date(choice.removeAt as string) < new Date();
const removeText = new Date(choice.removeAt as string).toLocaleString(
	undefined,
	{
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		hour: 'numeric',
		minute: 'numeric',
	}
);

type Vote = {
	user_id: string;
	image_url: string;
	profiles: {
		username: string;
		first_vote: number;
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

const userVoted = computed(() =>
	profile.votes.value?.find((vote) => vote.choice_id === props.id)
);

const userCreated = computed(() => choice.username === profile.username.value);

const firstTimeVoters = computed(() => {
	return data.votes
		.filter((vote) => vote.profiles.first_vote === props.id)
		.map((vote) => ({
			username: vote.profiles.username,
			userId: vote.user_id,
		}));
});

const newRecruits = computed(() => {
	const rucruitIds = firstTimeVoters.value.map((voter) => voter.userId);
	return rucruitIds.filter((id) => !profile.recruits.value.includes(id));
});

try {
	const response = await supabase
		.from('votes')
		.select(
			`
			user_id,
			image_url,
			profiles(username, first_vote)
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

if (userCreated.value && newRecruits.value.length) {
	const recruits = [...profile.recruits.value, ...newRecruits.value];

	try {
		await supabase
			.from('profiles')
			// @ts-ignore
			.update({ recruits })
			.eq('user_id', profile.userId.value);

		profile.recruits.value = recruits;
	} catch (error) {
		alert(error);
	}
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

.box {
	margin-block: 2em;
}

@media (min-width: 1000px) {
	.welcome {
		grid-column: span 2;
	}
}
</style>
