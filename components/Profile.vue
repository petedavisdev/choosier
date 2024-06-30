<script setup lang="ts">
type Choices = null | { id: number }[];
type Votes = null | { choice_id: number }[];

const props = defineProps<{
	username: string;
}>();

const supabase = useSupabaseClient<Database>();
const { profile } = useProfile();

const data = reactive({
	userId: '',
	website: '',
	choices: [] as Choices,
	votes: [] as number[] | null,
});

const isUser = computed(() => profile.value?.username === props.username);

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
	data.website = response.data.website ?? '';
	data.choices = response.data.choices as Choices;

	const allVotes = response.data.votes as Votes;

	data.votes =
		allVotes
			?.filter(
				(vote) => !data.choices?.find((choice) => choice.id === vote.choice_id)
			)
			.map((vote) => vote.choice_id) || null;
} catch (error: unknown) {
	if (error instanceof Error) console.error(error.message);
}
</script>

<template>
	<Head>
		<Title>{{ props.username }} | Choosier</Title>
	</Head>

	<ProfileHeader
		v-if="data.userId"
		:username="props.username"
		:website="data.website"
		:is-user="isUser"
	/>

	<template v-else>
		<h1>Chooser not found</h1>
		<LinkTo :to="PATHS.home" class="button">Home</LinkTo>
	</template>

	<template v-if="data.userId && !data.choices && !data.votes">
		<h2>No activity</h2>
		<LinkTo :to="PATHS.home" class="button">Home</LinkTo>
	</template>

	<template v-if="data.userId">
		<h2>{{ isUser ? 'My choices' : 'Choices' }}</h2>
		<List
			:filter="['user_id', data.userId]"
			:edit="isUser"
			:allow-private="isUser"
		>
			<p>{{ username }} has no active choices.</p>
			<LinkTo v-if="isUser" :to="PATHS.new" class="button">
				+ New choice
			</LinkTo>
		</List>
	</template>

	<template v-if="data.votes?.length">
		<h2>{{ isUser ? 'My votes' : 'Votes' }}</h2>
		<List :filter="['id', data.votes]" :allow-private="isUser">
			<p>{{ username }} has no votes to show</p>
		</List>
	</template>
</template>
