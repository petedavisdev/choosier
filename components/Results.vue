<script setup lang="ts">
import type { Choice } from '../composables/useChoice';

const props = defineProps<{
	id: Choice['id'];
	isPrivate: boolean;
	isCreator: boolean;
	isVoter: boolean;
	votingSystem: Choice['votingSystem'];
}>();

const choice = await useChoice(props.id);
const { profile } = useProfile();
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
		<Meta v-if="props.isPrivate" name="robots" content="noindex" />
	</Head>

	<template v-if="!profile && !choice.isClosed">
		<h1>Results</h1>
		<p>You need to vote or login to see the results so far...</p>
		<h2>Vote</h2>
		<List :filter="['id', props.id]" />
		<h2>Login</h2>
		<UserLogin />
	</template>

	<template v-else-if="!props.isCreator && !props.isVoter && !choice.isClosed">
		<h1>Vote first, then see the results</h1>
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
				{{ props.isVoter ? 'You helped' : 'Help' }}
				<LinkTo :to="PATHS.user + choice.username">
					{{ choice.username }}
				</LinkTo>
				choose
			</small>
			{{ choice.title }}
		</h1>

		<template v-if="choice.isClosed">
			<h2>Final results</h2>
			<p>
				Voting has closed. Results available until
				{{ longDateText(choice.removeAt) }}
			</p>
		</template>

		<h2 v-else>Results so far...</h2>

		<ResultsChart
			:images="choice.images"
			:votes="choice.votes"
			:voting-system="props.votingSystem"
		/>

		<div class="grid" :class="$style.meta">
			<ResultsRecruits
				:id="id"
				:recruiter-name="choice.username"
				:is-recruiter="props.isCreator"
				:votes="choice.votes"
			/>

			<aside v-if="!choice.isClosed && !props.isPrivate" class="box">
				<h2>Share to get more votes</h2>
				<Share :id="props.id" />
			</aside>

			<template v-if="props.isCreator">
				<ChoicePromote :choice="choice" />
			</template>
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
