<script setup lang="ts">
const props = defineProps<{
	title: string;
	username: string;
	validationMessage: string;
	close: () => void;
}>();
</script>

<template>
	<div :class="$style.container">
		<div id="preview" class="backdrop" @click="props.close"></div>
		<section class="box" :class="$style.box">
			<button @click="props.close" type="button" class="close"></button>

			<h2 v-if="props.validationMessage">{{ props.validationMessage }}</h2>

			<template v-else>
				<h2>Listing preview</h2>

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
	cursor: unset;
	margin-bottom: 2em;
}
</style>
