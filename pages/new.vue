<template>
	<div>
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
	</div>
</template>

<style scoped>
aside {
	background-color: var(--mid);
	padding: 0.25em 1em;
	margin-block: 1em;
}
</style>
