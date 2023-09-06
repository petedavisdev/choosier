<script setup lang="ts">
const config = useRuntimeConfig();
useProfile().getProfile();
</script>

<template>
	<Head>
		<Title>Choosier - image polls made easy</Title>
		<Html lang="en" />
		<Meta
			name="description"
			content="Too many options? Use Choosier to create an image poll. Collect votes from friends, colleagues and customers. Perfect for art, design, fashion and photography."
		/>
		<Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
		<Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
		<Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
		<Link rel="manifest" href="/site.webmanifest" />
		<Link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
		<Meta name="msapplication-TileColor" content="#2b5797" />
		<Meta name="theme-color" content="#000000" />
	</Head>

	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
