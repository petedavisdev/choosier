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
	currentMatchIndex: 0,
	options1: [] as Options,
	options2: [] as Options,
	matches1: [] as Matches,
	matches2: [] as Matches,
	vote1: undefined as Vote,
	vote2: undefined as Vote,
});

data.options1 = choice.images;
data.matches1 = createMatches(data.options1);

const allMatches = computed(() => [...data.matches1, ...data.matches2]);

const matchCount = computed(() => {
	if (choice.votingSystem === '2' && !data.matches2.length) {
		return data.options1.length + 1;
	}
	return allMatches.value.length;
});

function createMatches(images: Options) {
	return images
		.map((_image, index) => [images[2 * index], images[2 * index + 1]])
		.slice(0, -1);
}

function updateMatches(matchIndex: number, chosenOption?: string) {
	const newMatchIndex1 = Math.floor((data.options1.length + matchIndex) / 2);
	const matchIndex2 = matchIndex - data.matches1.length;
	const newMatchIndex2 = Math.floor((data.options2.length + matchIndex2) / 2);
	data.currentMatchIndex += 1;

	if (newMatchIndex1 < data.matches1.length) {
		const position = (data.options1.length + matchIndex) % 2;
		const match = data.matches1[newMatchIndex1];
		if (match) match[position] = chosenOption;
	} else if (newMatchIndex1 === data.matches1.length && newMatchIndex2 < 1) {
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
	} else if (newMatchIndex2 < data.matches2.length) {
		const position = (data.options2.length + matchIndex2) % 2;
		const match = data.matches2[newMatchIndex2];
		if (match) match[position] = chosenOption;
	} else {
		data.vote2 = chosenOption;
	}
}

function undo() {
	console.log('undo', data.currentMatchIndex);
	if (data.currentMatchIndex === data.matches1.length) {
		data.options2 = [];
		data.matches2 = [];
		data.vote1 = '';
	}

	if (data.currentMatchIndex === allMatches.value.length) {
		data.vote2 = '';
	}

	data.currentMatchIndex -= 1;

	// @ts-expect-error - TS doesn't know about the form names
	const previousForm = document.forms['match' + data.currentMatchIndex];

	if (previousForm) {
		previousForm.reset();
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
			:content="`Image poll made with Choosier.com — Visual decisions made easy`"
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
			v-for="(match, matchIndex) in allMatches"
			v-show="!data.vote1 || (choice.votingSystem === '2' && !data.vote2)"
			:id="'match' + matchIndex"
			:key="matchIndex"
			ref="chooseForm"
			:class="$style.match"
			:data-cy="`match-${matchIndex < data.matches1.length ? 1 : 2}`"
			@submit.prevent
		>
			<label
				v-for="(option, optionIndex) in match"
				:key="optionIndex"
				:class="$style.option"
			>
				<input
					type="radio"
					:name="'option' + matchIndex"
					required
					:class="$style.optionInput"
					@input="updateMatches(matchIndex, option)"
				/>

				<img
					:src="option"
					alt=""
					:class="$style.optionImage"
					data-cy="option-image"
				/>
			</label>
		</form>

		<ChooseConfirm
			v-if="data.vote1 && (data.vote2 || choice.votingSystem === '1')"
			:id="props.id"
			:class="$style.confirm"
			:vote1="data.vote1"
			:vote2="data.vote2"
		/>

		<ChooseControls
			:id="props.id"
			:class="$style.controls"
			:match-index="data.currentMatchIndex"
			:match-count="matchCount + 1"
			:allow-share="choice.visibility !== 'private'"
			@undo="undo"
		/>

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

		<ChooseIntro
			v-else
			:username="choice.username"
			:title="choice.title"
			:voting-system="choice.votingSystem"
		/>
	</main>
</template>

<style module>
.container {
	height: 100%;
	display: grid;
	place-content: end center;
	grid-template: '📋' 1fr / 1fr;
}

.confirm,
.match {
	grid-area: 📋;
	display: grid;
	gap: 1em;
	grid-template:
		'1️⃣' 1fr
		'2️⃣' 1fr
		/ 1fr;
	height: calc(var(--windowHeight, 100svh) - 75px);
	padding: 1.5em 1.5em 0.5em;
}

.match {
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
	.confirm,
	.match {
		grid-template:
			'1️⃣ 2️⃣' 1fr
			/ 1fr 1fr;
	}
}

.option {
	position: relative;
	display: grid;
	place-content: center;
	min-height: 0;
	cursor: pointer;
}

.optionInput {
	display: block;
	position: fixed;
	opacity: 0;
}

.optionImage {
	width: 100%;
	min-height: 0;
	max-height: 100%;
	object-fit: contain;
	line-height: 1;
	background-color: var(--lighter);
}

.optionInput:not(:checked):valid + .optionImage {
	opacity: 0;
	scale: 0.5;
	transition:
		opacity 1s ease-out,
		scale 1s ease-in;
}

.optionInput:checked:valid + .optionImage {
	scale: 1.05;
	transition: scale 1s ease-out;
}
</style>
