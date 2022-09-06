<template>
	<main>
		<form
			v-for="(match, matchIndex) in state.matches"
			@reset="updateMatches(matchIndex)"
			:name="'match' + matchIndex"
		>
			<Vote v-if="matchIndex === length - 1 && match[0]" :image="match[0]" />

			<template v-else>
				<label v-for="(option, optionIndex) in match" class="option">
					<input
						type="radio"
						:name="'option' + matchIndex"
						@input="updateMatches(matchIndex, option)"
						required
					/>

					<img :src="option" alt="" />
				</label>
			</template>

			<footer class="controls">
				<Progress :percent="(100 * matchIndex) / (length - 1)" />
				<button
					class="undo"
					title="undo"
					type="reset"
					@click="undo(matchIndex)"
					:disabled="!matchIndex"
				>
					←
				</button>
			</footer>
		</form>
	</main>
</template>

<script setup lang="ts">
import options from '../chocolate.json';
const length = options.length;

const state = reactive({
	matches: [],
});

state.matches = options.map((_option, index) => [
	options[2 * index],
	options[2 * index + 1],
]);

function updateMatches(matchIndex: number, option?: string) {
	const match = Math.floor((length + matchIndex) / 2);
	const position = (length + matchIndex) % 2;

	state.matches[match][position] = option;
}

function undo(matchIndex: number) {
	document.forms['match' + (matchIndex - 1)].reset();
}
</script>

<style>
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
	height: var(--windowHeight, 100vh);
	padding: 1em 1em 0;
	opacity: 1;
	transition: opacity 1s;
}

form:valid,
form:invalid + form {
	opacity: 0;
	pointer-events: none;
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
}

.option img {
	object-fit: contain;
	min-height: 0;
	max-width: 100%;
	max-height: 100%;
	line-height: 1;
	background-color: white;
}

.option:focus-within img {
	outline: var(--darker) 3px solid;
	outline-offset: -3px;
}

footer {
	transition: opacity 1s;
}

.undo {
	border: none;
	background-color: transparent;
	font-size: xx-large;
	padding-left: 0;
}

.undo:disabled {
	color: silver;
}

@media (orientation: landscape) {
	form {
		grid-template:
			'1️⃣ 2️⃣' 1fr
			'🦶 🦶' max-content
			/ 1fr 1fr;
	}

	footer {
		grid-area: 🦶;
	}
}
</style>
