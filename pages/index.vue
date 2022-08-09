<template>
	<main>
		<Logo class="logo" />
		<h1>
			<span class="sr-only">Choosier. </span>
			Visual decisions made easy
		</h1>
	</main>
</template>

<style scoped>
main {
	height: calc(100% - 56px);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: clamp(1em, 5vmin, 4em);
}

.logo {
	fill: var(--darker);
	width: clamp(12em, 50vmin, 24em);
}

h1 {
	font-size: clamp(1.5em, 5vmin, 2em);
}
</style>
