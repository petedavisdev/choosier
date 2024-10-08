<script setup lang="ts">
useProfile().getProfile();
</script>

<template>
	<Head>
		<Title>Choosier - image polls made easy</Title>
		<Html lang="en" />
		<Meta
			name="description"
			content="Get help with art, design, fashion, photo and color choices. Create an image poll and share it with friends, followers, colleagues and customers."
		/>
		<Link
			rel="icon"
			type="image/png"
			href="/icons/favicon-48x48.png"
			sizes="48x48"
		/>
		<Link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
		<Link rel="shortcut icon" href="/icons/favicon.ico" />
		<Link
			rel="apple-touch-icon"
			sizes="180x180"
			href="/icons/apple-touch-icon.png"
		/>
		<Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
		<Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
		<Link rel="manifest" href="/site.webmanifest" />
		<Link rel="mask-icon" href="/icons/favicon.svg" color="#5bbad5" />
		<Meta name="apple-mobile-web-app-title" content="Choosier" />
		<Meta name="msapplication-TileColor" content="#eeeeee" />
		<Meta name="theme-color" content="#eeeeee" />
		<Meta property="og:site_title" content="Choosier" />
	</Head>

	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
