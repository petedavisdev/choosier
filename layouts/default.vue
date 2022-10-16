<template>
	<main>
		<Logo class="logo" />
		<h1>
			<span class="sr-only">Choosier. </span>
			Visual decisions made easy
		</h1>
		<slot />
	</main>
</template>

<style scoped>
main {
	padding: 4em 2em 6em;
	max-width: 36em;
	margin-inline: auto;
}

.logo {
	width: clamp(12em, 50vmin, 24em);
}

h1 {
	font-size: clamp(1.5em, 5vmin, 2em);
}
</style>
