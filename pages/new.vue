<script setup lang="ts">
definePageMeta({
	layout: false,
});
</script>

<template>
	<main :class="$style.container">
		<header>
			<IconLogo />
			<h1>New choice</h1>
		</header>
		<NewChoice />
	</main>
</template>

<style module>
.container {
	max-width: 36em;
	display: grid;
	margin-inline: auto;
	padding: 2em 2em 6em;
}

@media (min-width: 700px) {
	.container {
		padding: 2em 3em 6em;
		margin-inline: auto;
	}
}
</style>
