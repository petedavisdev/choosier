<script setup lang="ts">
const props = defineProps<{
	match: (string | undefined)[];
	matchIndex: number;
	updateMatches: (matchIndex: number, option?: string) => void;
}>();
</script>

<template>
	<label
		v-for="(option, optionIndex) in match"
		:key="optionIndex"
		:class="$style.option"
	>
		<input
			type="radio"
			:name="'option' + matchIndex"
			@input="updateMatches(matchIndex, option)"
			required
			:class="$style.optionInput"
		/>

		<img :src="option" alt="" :class="$style.optionImage" />
	</label>
</template>

<style module>
.option {
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
	object-fit: contain;
	width: 100%;
	min-height: 0;
	max-height: 100%;
	line-height: 1;
	background-color: var(--light);
}

.optionInput:not(:checked):valid + .optionImage {
	opacity: 0;
	scale: 0.5;
	transition: opacity 1s ease-out, scale 1s ease-in;
}

.optionInput:checked:valid + .optionImage {
	scale: 1.05;
	transition: scale 1s ease-out;
}
</style>
