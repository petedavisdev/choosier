<template>
	<Head>
		<Title>Help @{{ choice.username }} choose: {{ choice.title }}</Title>
		<Meta
			name="description"
			:content="`Image poll made with Choosier.app — Visual decisions made easy`"
		/>
		<Meta property="og:image" :content="choice.ogimage || choice.images?.[0]" />
	</Head>

	<main v-if="choice.title">
		<form
			v-for="(match, matchIndex) in data.matches"
			@submit.prevent
			@reset="updateMatches(matchIndex)"
			:id="'match' + matchIndex"
			:key="matchIndex"
			ref="chooseForm"
		>
			<ChooseConfirm
				v-if="matchIndex === length - 1 && match[0]"
				:image="match[0]"
				:id="+props.id"
			/>

			<template v-else>
				<label
					v-for="(option, optionIndex) in match"
					class="option"
					:key="optionIndex"
				>
					<input
						type="radio"
						:name="'option' + matchIndex"
						@input="updateMatches(matchIndex, option)"
						required
					/>

					<img :src="option" alt="" />
				</label>
			</template>

			<ChooseControls
				class="controls"
				:matchIndex="matchIndex"
				:length="length"
				:id="props.id"
			/>
		</form>

		<aside class="popup backdrop" v-if="closed">
			<LinkTo :to="'/result' + props.id" class="button">
				Voting has closed
				<h2>See the results &rarr;</h2>
			</LinkTo>
		</aside>

		<aside class="popup backdrop" v-else-if="userVoted">
			<LinkTo :to="'/result' + props.id" class="button">
				You have made your choice
				<h2>See the results &rarr;</h2>
			</LinkTo>
		</aside>

		<ChooseIntro
			v-else
			class="popup"
			:username="choice.username"
			:title="choice.title"
		/>
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

<script setup lang="ts">
import { windowHeightFix } from '~~/helpers/windowHeightFix';

const props = defineProps<{
	id: number;
}>();

const profile = useProfile();
const choice = await useChoice(props.id);
const length = choice.images?.length;
const closed = new Date(choice.closeAt as string) < new Date();

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

<style scoped>
main {
	height: 100%;
	display: grid;
	place-content: end center;
	grid-template: '📋' 1fr / 1fr;
}

form {
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

form:not(:last-of-type):valid,
form:invalid + form {
	opacity: 0;
	pointer-events: none;
}

form:invalid + form {
	transition: opacity 0.5s;
}

input {
	display: block;
}

[type='radio'] {
	position: fixed;
	opacity: 0;
}

.option {
	display: grid;
	place-content: center;
	min-height: 0;
	cursor: pointer;
}

.option img {
	object-fit: contain;
	width: 100%;
	min-height: 0;
	max-height: 100%;
	line-height: 1;
	background-color: var(--lighter);
}

form:not(:last-of-type):valid :not(:checked) + img {
	opacity: 0;
}

@media (orientation: landscape) {
	form {
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
