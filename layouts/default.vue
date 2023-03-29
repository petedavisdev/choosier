<script setup lang="ts">
defineOgImageScreenshot();
const profile = useProfile();
</script>

<template>
	<main :class="$style.container">
		<IconLogo :class="$style.logo" />
		<slot />
		<nav :class="$style.nav">
			<NuxtLink
				:to="
					profile.username.value ? '/@' + profile.username.value : '/account'
				"
				class="button"
			>
				{{
					profile.username.value
						? '@' + profile.username.value
						: profile.userId.value
						? 'Account'
						: 'Login'
				}}
			</NuxtLink>
			<NuxtLink to="/new" class="New button">+ New</NuxtLink>
		</nav>
	</main>

	<footer :class="$style.container">
		<p>
			<NuxtLink to="/privacy">Essential cookies only</NuxtLink> |
			<NuxtLink to="/terms">Terms of use</NuxtLink> | Choosier &copy;
			{{ new Date().getFullYear() }}
			<LinkTo to="https://petedavis.dev">Pete Davis</LinkTo> |
			<LinkTo to="/contact">Say hello 👋</LinkTo>
		</p>
	</footer>
</template>

<style module>
.container {
	display: grid;
	margin-inline: auto;
	padding: 2em 2em 5em;
}
ß .logo {
	width: clamp(12em, 50vmin, 16em);
}

.nav {
	position: fixed;
	bottom: 1.5em;
	right: 1em;
	z-index: 1;
	display: grid;
	grid-auto-flow: column;
	gap: 1.5em;
}

@media (min-width: 700px) {
	.nav {
		top: 1.5em;
		right: 1.5em;
		bottom: auto;
	}
}
</style>
