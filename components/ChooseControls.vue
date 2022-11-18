<template>
	<footer class="controls">
		<ChooseProgress
			:percent="(100 * props.matchIndex) / (props.length - 1)"
			class="progress"
		/>

		<button
			class="undo"
			title="undo"
			type="reset"
			@click="undo()"
			:disabled="props.matchIndex === 0"
		>
			<IconUndo class="icon" />
		</button>

		<IconLogo class="logo" />

		<button>
			<IconShare class="icon" />
		</button>
	</footer>
</template>

<script setup lang="ts">
const props = defineProps<{
	matchIndex: number;
	length: number;
}>();

function undo() {
	let previousForm: HTMLFormElement | undefined;

	// @ts-ignore: form accessed by name not number
	previousForm = document.forms['match' + (props.matchIndex - 1)];

	if (previousForm) {
		previousForm.reset();
	}
}
</script>

<style scoped>
button {
	border: none;
	background-color: transparent;
	padding-left: 0;
}

.undo:disabled {
	color: var(--mid);
}

footer {
	display: grid;
	grid-template:
		'⌛️ ⌛️ ⌛️' max-content
		'👈 🪵 😘' 1fr
		/ max-content 1fr max-content;
	padding-block: 0.5em;
	gap: 0.5em;
}

.progress {
	grid-area: ⌛️;
}

button .icon {
	height: 3em;
}

.logo {
	grid-area: 🪵;
	width: 12em;
	place-self: center;
}
</style>
