<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();

const props = defineProps<{
	heading: string;
	title: string;
	username: string;
	validationMessage: string;
}>();
</script>

<template>
	<div :class="$style.container">
		<div id="preview" class="backdrop" @click="emit('close')"></div>
		<section class="box" :class="$style.box">
			<button type="button" class="close" @click="emit('close')"></button>

			<h2 v-if="props.validationMessage">{{ props.validationMessage }}</h2>

			<template v-else>
				<h2>{{ props.heading }} poll</h2>

				<div class="card" :class="$style.card">
					<slot name="card-images" />

					<div class="cardTitle">
						<small>Help {{ props.username }} choose</small>
						<div>{{ props.title || 'No title' }}</div>
					</div>
				</div>
				<slot />
			</template>
		</section>
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
	z-index: 1;
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
</style>
