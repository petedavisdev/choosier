<template>
	<Head>
		<Title>Choosier. @{{ username }}</Title>
	</Head>

	<div>
		<h1 v-if="data.userId">
			@{{ props.username }}
			<LinkTo v-if="user?.id === data.userId" to="/account">
				<IconSettings class="icon" />
			</LinkTo>
		</h1>

		<template v-else>
			<h1>Chooser not found</h1>
			<LinkTo to="/" class="button">Home</LinkTo>
		</template>

		<LinkTo v-if="data.website" :to="data.website" target="_blank">
			{{ data.website.replace(/^https?:\/\//, '') }}
			↗
		</LinkTo>

		<template v-if="data.userId && !data.choices && !data.votes">
			<h2>No activity</h2>
			<LinkTo to="/" class="button">Home</LinkTo>
		</template>

		<template v-if="data.choices?.length">
			<h2>Choices</h2>
			<section class="grid">
				<Card v-for="choice in data.choices" :key="choice.id" :id="choice.id" />
			</section>
		</template>

		<template v-if="data.votes?.length">
			<h2>Votes</h2>
			<section class="grid">
				<Card
					v-for="vote in data.votes"
					:key="vote.choice_id"
					:id="vote.choice_id"
				/>
			</section>
		</template>
	</div>
</template>

<script setup lang="ts">
type Choices = null | { id: number }[];
type Votes = null | { choice_id: number }[];

const props = defineProps<{
	username: string;
}>();

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const data = reactive({
	userId: '',
	website: '',
	choices: [] as Choices,
	votes: [] as Votes,
});

try {
	const response = await supabase
		.from('profiles')
		.select(
			`user_id, 
			website,
			choices!choices_user_id_fkey(id),
			votes(choice_id)`
		)
		.eq('username', props.username)
		.single();

	if (response.error) throw response.error;

	data.userId = response.data.user_id;
	data.website = response.data.website;
	data.choices = response.data.choices as Choices;

	const allVotes = response.data.votes as Votes;

	data.votes =
		allVotes?.filter(
			(vote) => !data.choices?.find((choice) => choice.id === vote.choice_id)
		) || null;
} catch (error: any) {
	console.error(error.message);
	console.warn(error.hint);
}
</script>

<style scoped>
.icon {
	width: 0.8em;
	height: 0.8em;
	text-decoration: none;
}
</style>
