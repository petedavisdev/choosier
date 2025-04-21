<script setup lang="ts">
const props = defineProps<{ id: number }>();

const { profile } = useProfile();
const choice = await useChoice(props.id);

if (!choice.images?.length || choice.isRemoved) navigateTo(PATHS.home);

const userVoted = computed(() =>
	profile.value?.votes.find((vote) => vote.choice_id === props.id)
);

type Vote = string | undefined;
type Options = Vote[];
type Matches = Options[];

const currentMatchIndex = ref(0);
const options1 = ref<Options>([]);
const options2 = ref<Options>([]);
const matches1 = ref<Matches>([]);
const matches2 = ref<Matches>([]);
const vote1 = ref<Vote>(undefined);
const vote2 = ref<Vote>(undefined);

options1.value = choice.images;
matches1.value = createMatches(options1.value);

const allMatches = computed(() => [...matches1.value, ...matches2.value]);

const matchCount = computed(() => {
	if (choice.votingSystem === '2' && !matches2.value.length) {
		return options1.value.length + 1;
	}
	return allMatches.value.length;
});

function createMatches(images: Options) {
	return images
		.map((_image, index) => [images[2 * index], images[2 * index + 1]])
		.slice(0, -1);
}

function updateMatches(matchIndex: number, chosenOption?: string) {
	const newMatchIndex1 = Math.floor((options1.value.length + matchIndex) / 2);
	const matchIndex2 = matchIndex - matches1.value.length;
	const newMatchIndex2 = Math.floor((options2.value.length + matchIndex2) / 2);
	currentMatchIndex.value += 1;

	if (newMatchIndex1 < matches1.value.length) {
		const position = (options1.value.length + matchIndex) % 2;
		const match = matches1.value[newMatchIndex1];
		if (match) match[position] = chosenOption;
	} else if (newMatchIndex1 === matches1.value.length && newMatchIndex2 < 1) {
		vote1.value = chosenOption;

		if (choice.votingSystem === '2') {
			options2.value = matches1.value
				.filter((match) => match.includes(chosenOption))
				.map((match) => (match[0] === chosenOption ? match[1] : match[0]));

			if (options2.value.length > 1) {
				matches2.value = createMatches(options2.value);
			} else {
				vote2.value = options2.value[0];
			}
		}
	} else if (newMatchIndex2 < matches2.value.length) {
		const position = (options2.value.length + matchIndex2) % 2;
		const match = matches2.value[newMatchIndex2];
		if (match) match[position] = chosenOption;
	} else {
		vote2.value = chosenOption;
	}
}

function undo() {
	console.log('undo', currentMatchIndex.value);
	if (currentMatchIndex.value === matches1.value.length) {
		options2.value = [];
		matches2.value = [];
		vote1.value = '';
	}

	if (currentMatchIndex.value === allMatches.value.length) {
		vote2.value = '';
	}

	currentMatchIndex.value -= 1;

	// @ts-expect-error - TS doesn't know about the form names
	const previousForm = document.forms['match' + currentMatchIndex.value];

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
		<Meta property="og:image" :content="useCover(props.id) || options1[0]" />
		<Meta
			v-if="choice.visibility === 'private'"
			name="robots"
			content="noindex"
		/>
	</Head>

	<main :class="$style.container">
		<form
			v-for="(match, matchIndex) in allMatches"
			v-show="!vote1 || (choice.votingSystem === '2' && !vote2)"
			:id="'match' + matchIndex"
			:key="matchIndex"
			ref="chooseForm"
			:class="$style.match"
			:data-testid="`match-${matchIndex < matches1.length ? 1 : 2}`"
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
					@change="updateMatches(matchIndex, option)"
				/>

				<img
					:src="option"
					alt=""
					:class="$style.optionImage"
					data-testid="option-image"
				/>
			</label>
		</form>

		<ChooseConfirm
			v-if="vote1 && (vote2 || choice.votingSystem === '1')"
			:id="props.id"
			:class="$style.confirm"
			:vote1="vote1"
			:vote2="vote2"
		/>

		<ChooseControls
			:id="props.id"
			:match-index="currentMatchIndex"
			:match-count="vote2 ? currentMatchIndex : matchCount + 1"
			:allow-share="choice.visibility !== 'private'"
			@undo="undo"
		/>

		<aside v-if="choice.isClosed" class="backdrop">
			<LinkTo
				:to="PATHS.results + props.id"
				class="button"
				:class="$style.modalButton"
			>
				Voting has closed
				<h2>See the results &rarr;</h2>
			</LinkTo>
		</aside>

		<aside v-else-if="userVoted" class="backdrop">
			<LinkTo
				:to="PATHS.results + props.id"
				class="button"
				:class="$style.modalButton"
			>
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

.modalButton {
	background-color: var(--lighter);
}
</style>
