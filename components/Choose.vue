<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const { profile } = useProfile();
const choice = await useChoice(props.id);
const length = choice.images.length;

const data = reactive({
	matches: [] as (string | undefined)[][],
});

const userVoted = computed(
	() => profile.value?.votes.find((vote) => vote.choice_id === props.id)
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
		<Title>Help {{ choice.username }} choose: {{ choice.title }}</Title>
		<Meta
			name="description"
			:content="`Image poll made with Choosier.app — Visual decisions made easy`"
		/>
		<Meta
			property="og:image"
			:content="useCover(props.id) || choice.images?.[0]"
		/>
	</Head>

	<main v-if="choice.title && !choice.isRemoved" :class="$style.container">
		<form
			v-for="(match, matchIndex) in data.matches"
			:id="'match' + matchIndex"
			:key="matchIndex"
			ref="chooseForm"
			:class="$style.match"
			@submit.prevent
			@reset="updateMatches(matchIndex)"
		>
			<ChooseConfirm
				v-if="matchIndex === length - 1 && match[0]"
				:id="props.id"
				:image="match[0]"
			/>

			<ChooseMatch
				v-else
				:match="match"
				:match-index="matchIndex"
				:update-matches="updateMatches"
			/>

			<ChooseControls
				:id="props.id"
				:class="$style.controls"
				:match-index="matchIndex"
				:length="length"
			/>
		</form>

		<aside v-if="choice.isClosed" class="backdrop">
			<LinkTo :to="PATHS.results + props.id" class="button">
				Voting has closed
				<h2>See the results &rarr;</h2>
			</LinkTo>
		</aside>

		<aside v-else-if="userVoted" class="backdrop">
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
	height: var(--windowHeight, 100svh);
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
