<script setup lang="ts">
definePageMeta({
	layout: false,
});
</script>

<template>
	<Head>
		<Title>Image poll creator | Choosier</Title>
		<Meta
			name="description"
			content="Use Choosier to create an image poll, collect votes and make better visual decisions. Perfect for art, design, fashion and photography choices."
		/>
	</Head>

	<main :class="$style.container">
		<header>
			<IconLogo />
			<h1>Create an image poll</h1>
		</header>
		<New />
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
