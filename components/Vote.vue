<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const choice = await useChoice(props.id);

const options1 = choice.images;

const data = reactive({
	matches1: createMatches(options1),
	vote1: '',
	options2: [] as string[],
	matches2: [] as string[][],
	vote2: '',
});

function createMatches(options: string[]) {
	return options
		.map((_option, index) => [options[2 * index], options[2 * index + 1]])
		.slice(0, -1);
}

function updateMatches1(matchIndex: number, chosenOption: string) {
	const newMatchIndex = Math.floor((options1.length + matchIndex) / 2);

	if (newMatchIndex < data.matches1.length) {
		const position = (options1.length + matchIndex) % 2;
		data.matches1[newMatchIndex][position] = chosenOption;
	} else {
		data.vote1 = chosenOption;

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

function updateMatches2(matchIndex: number, chosenOption: string) {
	const newMatchIndex = Math.floor((data.options2.length + matchIndex) / 2);

	if (newMatchIndex < data.matches2.length) {
		const position = (data.options2.length + matchIndex) % 2;
		data.matches2[newMatchIndex][position] = chosenOption;
	} else {
		data.vote2 = chosenOption;
	}
}

function undo(matchSet: 1 | 2, matchIndex: number) {
	const previousForm =
		document.forms[`match${matchSet}-${matchIndex - 1}` as any];

	previousForm?.reset();
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
		{{ id }}
	</main>
</template>

<style module>
.container {
	height: 100%;
	display: grid;
	place-content: end center;
	grid-template: '📋' 1fr / 1fr;
}
</style>
