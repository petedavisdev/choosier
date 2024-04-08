<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const choice = await useChoice(props.id);
const { profile } = useProfile();
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

const isVoter = computed(() =>
	profile.value?.votes?.find((vote) => vote.choice_id === props.id)
);

const isCreator = computed(() => choice.username === profile.value?.username);
</script>

<template>
	<Head>
		<Title>Results: {{ choice.username }} {{ choice.title }}</Title>
		<Meta
			name="description"
			:content="`Results for ${choice.username} choosing ${choice.title}`"
		/>
		<Meta
			property="og:image"
			:content="useCover(props.id) || choice.images?.[0]"
		/>
		<Meta
			v-if="choice.visibility === 'private'"
			name="robots"
			content="noindex"
		/>
	</Head>

	<template v-if="!profile && !choice.isClosed">
		<h1>Results</h1>
		<p>You need to vote or login to see the results so far...</p>
		<h2>Vote</h2>
		<List :filter="['id', props.id]" />
		<h2>Login</h2>
		<UserLogin />
	</template>

	<template v-else-if="!isVoter && !choice.isClosed && !isCreator">
		<h1>Choose first, then see the results</h1>
		<List :filter="['id', props.id]" />
	</template>

	<div v-else-if="!profile?.username && !choice.isClosed">
		<UserEdit>
			<h1>My choosername</h1>
			<p>Enter a choosername to show on the results page</p>
		</UserEdit>
	</div>

	<template v-else-if="!choice.isRemoved">
		<h1>
			<small :class="$style.intro">
				{{ isVoter ? 'You helped' : 'Help' }}
				<LinkTo :to="PATHS.user + choice.username">
					{{ choice.username }}
				</LinkTo>
				choose
			</small>
			{{ choice.title }}
		</h1>

		<template v-if="choice.isClosed">
			<h2>Final results</h2>
			<p>Voting has closed. Results available until {{ removeText }}</p>
		</template>

		<h2 v-else>Results so far...</h2>

		<ResultsChart :images="choice.images" :votes="choice.votes as Vote[]" />

		<div class="grid" :class="$style.meta">
			<ResultsRecruits
				:id="id"
				:recruiter-name="choice.username"
				:is-recruiter="isCreator"
				:votes="choice.votes as Vote[]"
			/>

			<aside
				v-if="!choice.isClosed && choice.visibility !== 'private'"
				class="box"
			>
				<h2>Share to get more votes</h2>
				<Share :id="props.id" />
			</aside>
		</div>

		<footer>
			<h2>Latest choices...</h2>
			<List :filter="['', '']" open>No more choices available right now</List>

			<LinkTo :to="PATHS.new" class="button">+ Make your own choice</LinkTo>
		</footer>
	</template>
</template>

<style module>
.intro {
	display: block;
	font-size: 1rem;
}

.meta {
	margin-block: 2em;
}
</style>
