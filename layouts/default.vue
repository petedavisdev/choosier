<template>
	<main>
		<Logo class="Logo" />
		<h1>
			<span class="sr-only">Choosier. </span>
			Visual decisions made easy
		</h1>
		<NuxtLink to="/new" class="New button">+ New</NuxtLink>
		<slot />
	</main>
</template>

<style scoped>
main {
	padding: 2em 2em 6em;
	display: grid;
	margin-inline: auto;
}

.Logo {
	width: clamp(12em, 50vmin, 24em);
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
		padding: 4em 3em 6em;
		margin-inline: auto;
	}

	.New {
		top: 1.5em;
		right: 1.5em;
		bottom: auto;
	}
}
</style>
