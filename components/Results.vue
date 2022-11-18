<template>
	<div class="cen">
		<h1>
			<small
				>You helped
				<RouterLink :to="'/@' + choice.username"
					>@{{ choice.username }}</RouterLink
				>
				choose</small
			>
			{{ choice.title }}
		</h1>
		<p>Here are the results so far</p>
		<article v-for="(result, index) in results" :key="index">
			<img :src="result.imageUrl" alt="" />
			<div
				class="bar"
				:style="{
					width: (100 * result.voters.length) / mostVotes + '%',
				}"
			>
				<strong class="count">{{ result.voters.length }}</strong>
				<div class="mychoice" v-if="index === data.yourChoice">
					&larr; Your choice
				</div>
			</div>
		</article>
	</div>
</template>

<script setup lang="ts">
import { getSrc } from '~/helpers/getSrc';

interface vote {
	image_url: string;
	profiles: {
		username: string;
	};
}

interface result {
	imageUrl: string;
	voters: string[];
}

const props = defineProps<{
	id: number;
}>();

const supabase = useSupabaseClient();
const choice = await useChoice(props.id);

const data = reactive({
	loading: true,
	votes: [] as vote[],
	yourChoice: 1,
});

const results = computed(() => {
	return choice.images
		.map((image) => {
			const imageUrl = getSrc(image);
			return {
				imageUrl,
				voters: data.votes
					.filter((vote) => imageUrl === vote.image_url)
					.map((vote) => vote.profiles.username),
			};
		})
		.sort((a, b) => b.voters.length - a.voters.length);
});

const mostVotes = computed(() => results.value[0].voters.length);

try {
	const response = await supabase
		.from('votes')
		.select(
			`
			image_url,
			profiles(username)
			`
		)
		.eq('choice_id', props.id);

	if (response.error) throw response.error;

	data.votes = response.data as vote[];
} catch (error) {
	console.error(error);
} finally {
	data.loading = false;
}
</script>

<style scoped>
article {
	display: grid;
	grid-template-columns: 1fr 2fr;
	margin-top: 0.5em;
	max-width: 600px;
}

.bar {
	text-align: left;
	background-color: var(--mid);
}

.count {
	font-size: 3em;
	padding: 0.1em;
}

.mychoice {
	padding: 0.2em 0.5em;
	white-space: nowrap;
}

img {
	max-width: 100%;
	height: auto;
}
</style>
