<script setup lang="ts">
const { profile } = useProfile();
const route = useRoute();

useHead(() => ({
	link: [
		{
			rel: 'canonical',
			href: 'https://www.choosier.com' + route.path,
		},
	],
}));
</script>

<template>
	<main :class="$style.container">
		<IconLogo :class="$style.home" />
		<slot />
		<nav :class="$style.nav">
			<NuxtLink
				:to="profile?.username ? PATHS.user + profile?.username : PATHS.user"
				class="button"
				:class="$style.navButton"
			>
				{{
					profile?.username
						? profile?.username
						: profile?.userId
							? 'Account'
							: 'Login'
				}}
			</NuxtLink>

			<NuxtLink :to="PATHS.new" class="button" :class="$style.navButton">
				+ New
			</NuxtLink>
		</nav>
	</main>

	<footer :class="$style.container">
		<p>
			<NuxtLink to="/about">About</NuxtLink> |
			<NuxtLink to="/privacy">Essential cookies only</NuxtLink> |
			<NuxtLink to="/terms">Terms of use</NuxtLink> | Choosier &copy;
			{{ new Date().getFullYear() }}
			<LinkTo to="https://petedavis.dev">Pete Davis</LinkTo> |
			<LinkTo :to="PATHS.contact">Say hello 👋</LinkTo>
		</p>
	</footer>
</template>

<style module>
.container {
	display: grid;
	padding: 2em 2em 5em;
	margin-inline: auto;
	max-width: 1328px;
}

.home {
	width: clamp(12rem, 50vmin, 16rem);
}

.nav {
	position: fixed;
	bottom: 1.5rem;
	right: 1rem;
	z-index: 1;
	display: grid;
	grid-auto-flow: column;
	gap: 1.5rem;
}

.navButton {
	background-color: var(--lighter);
}

@media (min-width: 600px) {
	.nav {
		position: absolute;
		top: 1.5rem;
		right: 2rem;
		bottom: auto;
	}
}
</style>
