<script setup lang="ts">
const props = defineProps<{
	username: string;
	avatar?: string;
}>();

const firstLetter = props.username[0];
const lastLetter = props.username.at(-1)!;
const hue = Math.floor(((parseInt(lastLetter, 36) - 10) * 360) / 26);
</script>

<template>
	<img
		v-if="props?.avatar"
		:class="$style.avatar"
		:src="props.avatar"
		:alt="props.username"
		:title="props.username"
		height="110"
		width="110"
		loading="lazy"
	/>

	<div
		v-else
		:class="$style.avatar"
		:style="{
			backgroundColor: `hsl(${hue}deg, 60%, 70%)`,
			color: `hsl(${hue}deg, 90%, 40%)`,
		}"
		:title="props.username"
	>
		{{ firstLetter }}
	</div>
</template>

<style module>
.avatar {
	aspect-ratio: 1/1;
	display: grid;
	place-content: end center;
	font-size: 0.6em;
	line-height: 1.5;
	text-transform: uppercase;
	font-weight: bold;
}
</style>
