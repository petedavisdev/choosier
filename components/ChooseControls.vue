<script setup lang="ts">
const props = defineProps<{
	matchIndex: number;
	matchCount: number;
	id: number;
	allowShare: boolean;
}>();

const emit = defineEmits<{ undo: [] }>();

const data = reactive({
	isShareOpen: false,
});
</script>

<template>
	<footer :class="$style.controls">
		<ChooseProgress
			:percent="(100 * props.matchIndex) / (props.matchCount - 1)"
			:class="$style.progress"
		/>

		<button
			title="undo"
			type="reset"
			:disabled="props.matchIndex < 1"
			:class="$style.undo"
			data-cy="undo"
			@click="emit('undo')"
		>
			<IconUndo :class="$style.icon" />
		</button>

		<IconLogo :class="$style.logo" />

		<button
			v-if="allowShare"
			type="button"
			:class="$style.share"
			@click="data.isShareOpen = true"
		>
			<IconShare :class="$style.icon" />
		</button>

		<button v-else type="button" :class="$style.share" disabled>
			<IconLock :class="$style.icon" />
		</button>
	</footer>
	<aside
		v-if="data.isShareOpen"
		class="backdrop"
		@click.self="data.isShareOpen = false"
	>
		<div class="box">
			<button
				type="button"
				class="close"
				@click="data.isShareOpen = false"
			></button>
			<h2>Share</h2>
			<Share :id="props.id" />
		</div>
	</aside>
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
	padding: 0 1.5em;
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
</style>
