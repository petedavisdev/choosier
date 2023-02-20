<template>
	<div class="container">
		<div id="preview" class="backdrop" @click="props.close"></div>
		<section class="box">
			<button @click="props.close" type="button" class="close"></button>

			<h2 v-if="props.validationMessage">{{ props.validationMessage }}</h2>

			<template v-else>
				<h2>Listing preview</h2>

				<div class="card">
					<div class="cardImages">
						<img
							class="cardImage"
							v-for="image in props.images"
							:src="image.replace('h_800', 'h_320')"
							alt=""
							loading="lazy"
							height="320"
							width="320"
						/>
					</div>

					<div class="cardTitle">
						<small>Help @{{ props.username }} choose</small>
						<div>{{ props.title || 'No title' }}</div>
					</div>
				</div>
				<slot />
			</template>
		</section>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	images: string[];
	title: string;
	username: string;
	validationMessage: string;
	close: () => void;
}>();
</script>

<style scoped>
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
