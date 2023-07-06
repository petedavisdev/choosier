<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const profile = useProfile();
const choice = await useChoice(props.id);
const length = choice.images.length;

const data = reactive({
	matches: [] as (string | undefined)[][],
});

const userVoted = computed(() =>
	profile.votes.value?.find((vote) => vote.choice_id === props.id)
);

data.matches = choice.images?.map((_image, index) => [
	choice.images[2 * index],
	choice.images[2 * index + 1],
]);

function updateMatches(matchIndex: number, option?: string) {
	const match = Math.floor((length + matchIndex) / 2);
	const position = (length + matchIndex) % 2;

	data.matches[match][position] = option;
}

onMounted(() => {
	windowHeightFix();
});
</script>

<template>
	<Head>
		<Title>Help @{{ choice.username }} choose: {{ choice.title }}</Title>
		<Meta
			name="description"
			:content="`Image poll made with Choosier.app — Visual decisions made easy`"
		/>
		<Meta
			property="og:image"
			:content="useCover(choice.id) || choice.images?.[0]"
		/>
	</Head>

	<main v-if="choice.title && !choice.isRemoved" :class="$style.container">
		<form
			v-for="(match, matchIndex) in data.matches"
			@submit.prevent
			@reset="updateMatches(matchIndex)"
			:id="'match' + matchIndex"
			:key="matchIndex"
			ref="chooseForm"
			:class="$style.match"
		>
			<ChooseConfirm
				v-if="matchIndex === length - 1 && match[0]"
				:image="match[0]"
				:id="props.id"
			/>

			<ChooseMatch
				v-else
				:match="match"
				:matchIndex="matchIndex"
				:updateMatches="updateMatches"
			/>

			<ChooseControls
				:class="$style.controls"
				:matchIndex="matchIndex"
				:length="length"
				:id="props.id"
			/>
		</form>

		<aside class="backdrop" v-if="choice.isClosed">
			<LinkTo :to="PATHS.results + props.id" class="button">
				Voting has closed
				<h2>See the results &rarr;</h2>
			</LinkTo>
		</aside>

		<aside class="backdrop" v-else-if="userVoted">
			<LinkTo :to="PATHS.results + props.id" class="button">
				You have made your choice
				<h2>See the results &rarr;</h2>
			</LinkTo>
		</aside>

		<ChooseIntro v-else :username="choice.username" :title="choice.title" />
	</main>

	<main v-else>
		<form>
			<div>
				<IconLogo />
				<h1>Choice not found.</h1>
				<LinkTo to="/">&larr; Go back home</LinkTo>
			</div>
		</form>
	</main>
</template>

<style module>
.container {
	height: 100%;
	display: grid;
	place-content: end center;
	grid-template: '📋' 1fr / 1fr;
}

.match {
	grid-area: 📋;
	display: grid;
	gap: 1em;
	grid-template:
		'1️⃣' 1fr
		'2️⃣' 1fr
		'🦶' max-content
		/ 1fr;
	height: 100vh;
	height: var(--windowHeight, 100dvh);
	padding: 1.5em 1.5em 0.5em;
	opacity: 1;
	transition: opacity 1.5s;
}

.match:not(:last-of-type):valid,
.match:invalid + .match {
	opacity: 0;
	pointer-events: none;
}

.match:invalid + .match {
	transition: opacity 0.5s;
}

@media (orientation: landscape) {
	.match {
		grid-template:
			'1️⃣ 2️⃣' 1fr
			'🦶 🦶' max-content
			/ 1fr 1fr;
	}

	.controls {
		grid-area: 🦶;
	}
}
</style>
