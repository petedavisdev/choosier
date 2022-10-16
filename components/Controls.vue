<template>
	<footer class="controls">
		<Progress :percent="(100 * matchIndex) / (length - 1)" class="progress" />
		<button
			class="undo"
			title="undo"
			type="reset"
			@click="undo(matchIndex)"
			:disabled="matchIndex === 0"
		>
			<Undo class="icon" />
		</button>

		<Logo class="logo" />

		<button>
			<Share class="icon" />
		</button>
	</footer>
</template>

<script setup lang="ts">
defineProps<{ matchIndex: number; length: number }>();

function undo(matchIndex) {
	document.forms['match' + (matchIndex - 1)].reset();
}
</script>

<style scoped>
button {
	border: none;
	background-color: transparent;
	padding-left: 0;
}

.undo:disabled {
	color: silver;
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
	height: 1.5em;
	place-self: center;
}
</style>
