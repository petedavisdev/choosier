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

		<button @click="toggleShare" type="button" class="share">
			<IconShare class="icon" />
		</button>

		<aside v-if="data.shareOpen" class="drawer">
			{{ shareLink }}
			<button @click="copyText(shareLink)" type="button" class="button">
				Copy link
			</button>
		</aside>
	</footer>
</template>

<script setup lang="ts">
import { copyText } from '~/helpers/copyText';

const props = defineProps<{
	matchIndex: number;
	length: number;
}>();

const route = useRoute();
const shareLink = 'https://choosier.app/' + route.params.id;

const data = reactive({
	shareOpen: false,
});

function undo() {
	let previousForm: HTMLFormElement | undefined;

	// @ts-ignore: form accessed by name not number
	previousForm = document.forms['match' + (props.matchIndex - 1)];

	if (previousForm) {
		previousForm.reset();
	}
}

function toggleShare() {
	data.shareOpen = !data.shareOpen;
}
</script>

<style scoped>
.undo,
.share {
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
		'🎁 🎁 🎁' max-content
		/ max-content 1fr max-content;
	padding-block: 0.5em;
	gap: 0.5em;
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

button .icon {
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
