<script setup lang="ts">
const props = defineProps<{
	matchIndex: number;
	length: number;
	id: number;
}>();

const data = reactive({
	shareOpen: false,
});

function undo() {
	let previousForm: HTMLFormElement | undefined =
		// @ts-ignore: form accessed by name not number
		document.forms['match' + (props.matchIndex - 1)];

	if (previousForm) {
		previousForm.reset();
	}
}

function toggleShare() {
	data.shareOpen = !data.shareOpen;
}
</script>

<template>
	<footer :class="$style.controls">
		<ChooseProgress
			:percent="(100 * props.matchIndex) / (props.length - 1)"
			class="progress"
		/>

		<button
			title="undo"
			type="reset"
			@click="undo()"
			:disabled="props.matchIndex === 0"
			:class="$style.undo"
		>
			<IconUndo :class="$style.icon" />
		</button>

		<IconLogo :class="$style.logo" />

		<button @click="toggleShare" type="button" :class="$style.share">
			<IconShare :class="$style.icon" />
		</button>

		<aside v-if="data.shareOpen" :class="$style.drawer">
			<Share :id="props.id" />
		</aside>
	</footer>
</template>

<style module>
.controls {
	display: grid;
	grid-template:
		'⌛️ ⌛️ ⌛️' max-content
		'👈 🪵 😘' 1fr
		'🎁 🎁 🎁' max-content
		/ max-content 1fr max-content;
	gap: 0.5em;
	padding: 0;
}

.share,
.undo {
	border: none;
	background-color: transparent;
	padding: 0;
}

.undo:disabled {
	color: var(--mid);
}

.progress {
	grid-area: ⌛️;
}

.undo {
	grid-area: 👈;
}

.share {
	grid-area: 😘;
}

.icon {
	height: 3em;
}

.logo {
	grid-area: 🪵;
	width: 12em;
	place-self: center;
}

.drawer {
	grid-area: 🎁;
	display: grid;
	grid-template-columns: 1fr max-content;
	gap: 2em;
	text-align: right;
	padding-block: 0.5em;
	align-items: center;
}
</style>
