<template>
	<section class="Grid">
		<slot />
	</section>
</template>

<style scoped>
.Grid {
	display: grid;
	gap: 2em;
	margin-top: 1em;
	margin-bottom: 3em;
}

@media (min-width: 700px) {
	.Grid {
		grid-template-columns: 1fr 1fr;
	}
}

@media (min-width: 1000px) {
	.Grid {
		grid-template-columns: 1fr 1fr 1fr;
	}
}
</style>
