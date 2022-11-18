<template>
	<div>
		<h1 v-if="data.id">
			@{{ username }}
			<NuxtLink v-if="user?.id === data.id" to="/account">
				<IconSettings class="icon" />
			</NuxtLink>
		</h1>

		<template v-else>
			<h1>Chooser not found</h1>
			<NuxtLink to="/" class="button">Home</NuxtLink>
		</template>

		<template v-if="data.id && !data.choices && !data.votes">
			<h2>No activity</h2>
			<NuxtLink to="/" class="button">Home</NuxtLink>
		</template>

		<template v-if="data.choices.length">
			<h2>Choices</h2>
			<Grid>
				<Card v-for="choice in data.choices" :key="choice.id" :id="choice.id" />
			</Grid>
		</template>

		<template v-if="data.votes.length">
			<h2>Activity</h2>
			<Grid>
				<Card
					v-for="vote in data.votes"
					:key="vote.choice_id"
					:id="vote.choice_id"
				/>
			</Grid>
		</template>
	</div>
</template>

<script setup lang="ts">
const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const username = route.params.username;

const data = reactive({
	id: '',
	choices: [],
	votes: [],
});

try {
	const response = await supabase
		.from('profiles')
		.select(
			`id, 
			choices!choices_user_id_fkey(id),
			votes(choice_id)`
		)
		.eq('username', username)
		.single();

	if (response.error) throw response.error;

	data.id = response.data.id;
	// @ts-ignore: unreachable error
	data.choices = response.data.choices;
	// @ts-ignore: unreachable error
	data.votes = response.data.votes.filter(
		// @ts-ignore: unreachable error
		(vote) => !data.choices.find((choice) => choice.id === vote.choice_id)
	);
} catch (error: any) {
	console.error(error.message);
	console.warn(error.hint);
}
</script>

<style scoped>
a {
	text-decoration: none;
}

.icon {
	width: 0.8em;
	height: 0.8em;
}
</style>
