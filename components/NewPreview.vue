<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();

const props = defineProps<{
	heading: string;
	title: string;
	username: string;
	validationMessage: string;
	visibility: 'public' | 'private';
}>();
</script>

<template>
	<div
		id="preview"
		:class="$style.container"
		class="backdrop"
		@click.self="emit('close')"
	>
		<aside class="box" :class="$style.box">
			<button type="button" class="close" @click="emit('close')"></button>

			<h2 v-if="props.validationMessage">{{ props.validationMessage }}</h2>

			<template v-else>
				<h2>{{ props.heading }} poll</h2>

				<div class="card" :class="$style.card">
					<slot name="card-images" />

					<div
						v-if="props.visibility === 'private'"
						class="cardImages"
						:class="$style.lockBackdrop"
					>
						<IconLock :class="$style.lockIcon" />
					</div>

					<div class="cardTitle">
						<small>Help {{ props.username }} choose</small>
						<div>{{ props.title || 'No title' }}</div>
					</div>
				</div>
				<slot />
			</template>
		</aside>
	</div>
</template>

<style module>
.container {
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
}
.box {
	position: relative;
	width: 100%;
	max-width: 30em;
}
.card {
	pointer-events: none;
	cursor: unset;
	margin-bottom: 2em;
	width: 360px;
	background-color: var(--mid) !important;
}

.lockBackdrop {
	display: grid;
	place-items: center;
	background-color: var(--dark);
	opacity: 0.5;
}
.lockIcon {
	height: 8rem;
	width: 6rem;
	padding-bottom: 3rem;
	color: var(--lightest);
}
</style>
