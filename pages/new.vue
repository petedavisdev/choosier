<template>
	<main>
		<IconLogo />
		<h1>New choice</h1>

		<aside>
			<h2>Image uploads are coming soon...</h2>
			<p>
				While Choosier is in beta, I recommend uploading your images on
				<NuxtLink to="https://cloudinary.com/users/register_free"
					>Cloudinary</NuxtLink
				>
				and copying the URLs.
			</p>
		</aside>
		<NewChoice />
	</main>
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
});
</script>

<style scoped>
main {
	max-width: 50em;
	display: grid;
	margin-inline: auto;
	padding: 2em 2em 6em;
}

aside {
	background-color: var(--mid);
	padding: 0.25em 1em;
	margin-block: 1em;
}

@media (min-width: 700px) {
	main {
		padding: 2em 3em 6em;
		margin-inline: auto;
	}
}
</style>
