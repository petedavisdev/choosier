<template>
	<main>
		<IconLogo class="Logo" />
		<slot />
		<nav>
			<NuxtLink
				:to="profile.username ? '/@' + profile.username : '/account'"
				class="button"
			>
				{{
					profile.username
						? '@' + profile.username
						: profile.userId
						? 'My Account'
						: 'Login'
				}}
			</NuxtLink>
			<NuxtLink to="/new" class="New button">+ New</NuxtLink>
		</nav>
	</main>
</template>

<script setup lang="ts">
const profile = await useMyProfile();
</script>

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

nav {
	position: fixed;
	bottom: 1.5em;
	right: 1em;
	display: grid;
	grid-auto-flow: column;
	gap: 1.5em;
}

.icon {
	height: 1em;
	width: 1em;
}

@media (min-width: 700px) {
	main {
		padding: 2em 3em 6em;
		margin-inline: auto;
	}

	nav {
		top: 1.5em;
		right: 1.5em;
		bottom: auto;
	}
}
</style>
