<template>
	<Head>
		<Title>Choosier. Visual decisions made easy</Title>
		<Html lang="en" />
		<Meta
			name="description"
			content="Too many options? Use Choosier to create an image poll. Collect votes from friends, colleagues and customers. Perfect for art, design, fashion and photography."
		/>
		<Meta
			v-if="config.public.prod"
			httpEquiv="content-security-policy"
			:content="`default-src 'self' ${config.public?.apiBase} *.cloudinary.com *.vercel-insights.com 'unsafe-inline'`"
		/>
		<Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
		<Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
		<Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
		<Link rel="manifest" href="/site.webmanifest" />
		<Link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
		<Meta name="msapplication-TileColor" content="#2b5797" />
		<Meta name="theme-color" content="#eeeeee" />
	</Head>

	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
let act: NodeJS.Timeout;

useProfile().get();

function delayedAction(action: () => void) {
	clearTimeout(act);
	act = setTimeout(() => {
		action();
	}, 200);
}

function setWindowHeight() {
	const windowHeight = window.innerHeight;
	document.documentElement.style.setProperty(
		'--windowHeight',
		`${windowHeight}px`
	);
}

onMounted(() => {
	setWindowHeight();
	setTimeout(() => {
		setWindowHeight();
	}, 1000);
	window.onresize = () => delayedAction(setWindowHeight);
});
</script>

<style>
@import './assets/modern-normalize.css';
@import './assets/variables.css';
@import './assets/base.css';
@import './assets/utils.css';
</style>
