<script setup lang="ts">
const props = defineProps<{
	matchIndex: number;
	length: number;
	id: number;
	allowShare: boolean;
}>();

const data = reactive({
	shareOpen: false,
});

function undo() {
	const previousForm: HTMLFormElement | undefined =
		// @ts-expect-error Form accessed by name not number
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
			:class="$style.progress"
		/>

		<button
			title="undo"
			type="reset"
			:disabled="props.matchIndex === 0"
			:class="$style.undo"
			@click="undo()"
		>
			<IconUndo :class="$style.icon" />
		</button>

		<IconLogo :class="$style.logo" />

		<button
			v-if="allowShare"
			type="button"
			:class="$style.share"
			@click="toggleShare"
		>
			<IconShare :class="$style.icon" />
		</button>

		<button v-else type="button" :class="$style.share" disabled>
			<IconLock :class="$style.icon" />
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
	justify-content: end;
	padding-block: 0.5em;
}
</style>
