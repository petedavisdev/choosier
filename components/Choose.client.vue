<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const { profile } = useProfile();
const choice = await useChoice(props.id);

if (!choice.images?.length || choice.isRemoved) navigateTo(PATHS.home);

const userVoted = computed(() =>
	profile.value?.votes.find((vote) => vote.choice_id === props.id)
);

type Vote = string | undefined;
type Options = Vote[];
type Matches = Options[];

const data = reactive({
	options1: [] as Options,
	options2: [] as Options,
	matches1: [] as Matches,
	matches2: [] as Matches,
	vote1: undefined as Vote,
	vote2: undefined as Vote,
});

data.options1 = choice.images;
data.matches1 = createMatches(data.options1);

const matchCount = computed(() => {
	if (choice.votingSystem === '1') return data.options1.length - 1;
	const estimatedMatches = data.options1.length + 1;
	const totalMatches = data.matches1.length + data.matches2.length;
	return Math.max(estimatedMatches, totalMatches);
});

function createMatches(images: Options) {
	return images
		.map((_image, index) => [images[2 * index], images[2 * index + 1]])
		.slice(0, -1);
}

function updateMatches1(matchIndex: number, chosenOption?: string) {
	const newMatchIndex = Math.floor((data.options1.length + matchIndex) / 2);

	if (newMatchIndex < data.matches1.length) {
		const position = (data.options1.length + matchIndex) % 2;

		data.matches1[newMatchIndex][position] = chosenOption;
	} else {
		if (chosenOption) {
			data.vote1 = chosenOption;

			if (choice.votingSystem === '2') {
				data.options2 = data.matches1
					.filter((match) => match.includes(chosenOption))
					.map((match) => (match[0] === chosenOption ? match[1] : match[0]));

				if (data.options2.length > 1) {
					data.matches2 = createMatches(data.options2);
				} else {
					data.vote2 = data.options2[0];
				}
			}
		}
	}
}

function updateMatches2(matchIndex: number, chosenOption?: string) {
	const newMatchIndex = Math.floor((data.options2.length + matchIndex) / 2);

	if (newMatchIndex < data.matches2.length) {
		const position = (data.options2.length + matchIndex) % 2;
		data.matches2[newMatchIndex][position] = chosenOption;
	} else {
		data.vote2 = chosenOption;
	}
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
			:content="useCover(props.id) || data.options1?.[0]"
		/>
		<Meta
			v-if="choice.visibility === 'private'"
			name="robots"
			content="noindex"
		/>
	</Head>

	<main :class="$style.container">
		<form
			v-for="(match, matchIndex) in data.matches1"
			:id="'match' + matchIndex"
			:key="matchIndex"
			ref="chooseForm"
			:class="$style.match"
			@submit.prevent
			@reset="updateMatches1(matchIndex)"
		>
			<ChooseConfirm
				v-if="
					choice.votingSystem === '1' && matchIndex === matchCount && data.vote1
				"
				:id="props.id"
				:vote1="data.vote1"
			/>

			<ChooseMatch
				v-else
				:match="match"
				:match-index="matchIndex"
				:update-matches="updateMatches1"
			/>

			<ChooseControls
				:id="props.id"
				:class="$style.controls"
				:match-index="matchIndex"
				:length="matchCount"
				:allow-share="choice.visibility !== 'private'"
			/>
		</form>

		<form
			v-for="(match, matchIndex) in data.matches2"
			:id="'match' + (data.matches1.length + matchIndex)"
			:key="matchIndex"
			ref="chooseForm"
			:class="$style.match"
			@submit.prevent
			@reset="updateMatches1(matchIndex)"
		>
			<ChooseConfirm
				v-if="matchIndex === matchCount && data.vote1 && data.vote2"
				:id="props.id"
				:vote1="data.vote1"
				:vote2="data.vote2"
			/>

			<ChooseMatch
				v-else
				:match="match"
				:match-index="matchIndex"
				:update-matches="updateMatches2"
			/>

			<ChooseControls
				:id="props.id"
				:class="$style.controls"
				:match-index="data.matches1.length + matchIndex"
				:length="matchCount"
				:allow-share="choice.visibility !== 'private'"
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
