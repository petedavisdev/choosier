<template>
	<main>
		<header>
			<IconLogo />
			<h1>New choice</h1>
		</header>
		<NewChoice />
	</main>
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
});
</script>

<style scoped>
main {
	max-width: 36em;
	display: grid;
	margin-inline: auto;
	padding: 2em 2em 6em;
}

aside {
	background-color: var(--mid);
	padding: 0.25em 1em;
	margin-block: 1em;
}

@media (min-width: 700px) {
	main {
		padding: 2em 3em 6em;
		margin-inline: auto;
	}
}
</style>
