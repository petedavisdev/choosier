<template>
	<main>
		<IconLogo class="Logo" />
		<slot />
		<nav>
			<NuxtLink
				v-if="user"
				:to="data.username ? '/@' + data.username : '/account'"
				class="button"
			>
				<IconUser class="icon" />
				{{ data.username ? '@' + data.username : 'My Account' }}
			</NuxtLink>
			<NuxtLink to="/new" class="New button">+ New</NuxtLink>
		</nav>
	</main>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const data = reactive({
	username: '',
});

try {
	const response = await supabase
		.from('profiles')
		.select('username')
		.eq('email', user.value?.email)
		.single();

	if (response.error) throw response.error;

	data.username = response.data.username;
} catch (error: any) {
	console.error(error.message);
}
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
		padding: 3em 3em 6em;
		margin-inline: auto;
	}

	nav {
		top: 1.5em;
		right: 1.5em;
		bottom: auto;
	}
}
</style>
