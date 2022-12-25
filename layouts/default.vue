<template>
	<main>
		<IconLogo class="Logo" />
		<slot />
		<nav>
			<NuxtLink
				:to="
					profile.username.value ? '/@' + profile.username.value : '/account'
				"
				class="button"
			>
				{{
					profile.username.value
						? '@' + profile.username.value
						: user?.id
						? 'Account'
						: 'Login'
				}}
			</NuxtLink>
			<NuxtLink to="/new" class="New button">+ New</NuxtLink>
		</nav>
	</main>
	<footer>
		<p>
			<NuxtLink to="/privacy">Essential cookies only</NuxtLink> |
			<NuxtLink to="/terms">Terms of use</NuxtLink> | Choosier &copy;
			{{ new Date().getFullYear() }}
			<LinkTo to="https://petedavis.dev">Pete Davis</LinkTo> |
			<LinkTo to="https://www.instagram.com/choosier.app/" target="_blank"
				>Say hello on Instagram ↗</LinkTo
			>
		</p>
	</footer>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const profile = useProfile();
</script>

<style scoped>
main,
footer {
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
	z-index: 1;
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
		padding: 2em 3em 8em;
		margin-inline: auto;
	}

	nav {
		top: 1.5em;
		right: 1.5em;
		bottom: auto;
	}
}
</style>
