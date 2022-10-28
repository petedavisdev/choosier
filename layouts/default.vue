<template>
	<main>
		<Logo class="Logo" />
		<slot />
		<NuxtLink to="/new" class="New button">+ New</NuxtLink>
	</main>
</template>

<style scoped>
main {
	padding: 2em 2em 6em;
	display: grid;
	margin-inline: auto;
}

.Logo {
	width: clamp(12em, 50vmin, 16em);
}

h1 {
	font-size: clamp(1.5em, 5vmin, 2em);
}

.New {
	position: fixed;
	bottom: 1.5em;
	right: 1em;
}

@media (min-width: 500px) {
	main {
		padding: 3em 3em 6em;
		margin-inline: auto;
	}

	.New {
		top: 1.5em;
		right: 1.5em;
		bottom: auto;
	}
}
</style>
