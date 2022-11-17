<template>
	<main>
		<form
			v-for="(match, matchIndex) in data.matches"
			@reset="updateMatches(matchIndex)"
			:id="'match' + matchIndex"
			:key="matchIndex"
			ref="chooseForm"
		>
			<ChooseConfirm
				v-if="matchIndex === length - 1 && match[0]"
				:image="match[0] && getSrc(match[0])"
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

					<img :src="option && getSrc(option)" alt="" />
				</label>
			</template>

			<ChooseControls
				class="controls"
				:matchIndex="matchIndex"
				:length="length"
			/>
		</form>
	</main>
</template>

<script setup lang="ts">
import { getImages } from '~/helpers/getImages';
import { getSrc } from '~/helpers/getSrc';

const props = defineProps<{ id: string }>();
const images = getImages(props.id);
const length = images.length;

const data = reactive({
	matches: [] as (string | undefined)[][],
});

data.matches = images.map((_image, index) => [
	images[2 * index],
	images[2 * index + 1],
]);

function updateMatches(matchIndex: number, option?: string) {
	const match = Math.floor((length + matchIndex) / 2);
	const position = (length + matchIndex) % 2;

	data.matches[match][position] = option;
}
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
	height: var(--windowHeight, 100vh);
	padding: 1em 1em 0;
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
}

.option img {
	object-fit: contain;
	min-height: 0;
	max-width: 100%;
	max-height: 100%;
	line-height: 1;
	background-color: white;
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
