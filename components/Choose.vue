<template>
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
			<button
				class="undo"
				title="undo"
				type="reset"
				@click="undo(matchIndex)"
				:disabled="!matchIndex"
			>
				←
			</button>
			<Progress :percent="(100 * matchIndex) / (length - 1)" />
		</footer>
	</form>
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
form {
	padding-top: 1em;
	display: grid;
	grid-template-rows: 1fr 1fr max-content;
	gap: 1em;
	opacity: 1;
	transition: opacity 1s;
	grid-area: form;
}

form:valid,
form:invalid + form {
	opacity: 0;
	pointer-events: none;
}

form > * {
	display: grid;
	place-content: center;
}

input {
	display: block;
}

[type='radio'] {
	position: fixed;
	opacity: 0;
}

img {
	max-height: calc(50vh - 4em);
}

.option:focus-within img {
	outline: var(--darker) 3px solid;
	outline-offset: -3px;
}

footer {
	display: flex;
	justify-content: center;
	align-items: center;
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
		grid-template: 1fr max-content / 1fr 1fr;
		grid-template-areas: 'one two' 'footer footer';
	}

	footer {
		grid-area: footer;
	}

	img {
		max-height: calc(100vh - 6em);
	}
}
</style>
