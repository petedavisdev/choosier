<template>
	<Head>
		<Title>Choosier. Visual decisions made easy</Title>
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
		<Meta name="theme-color" content="#eeeeee" />
	</Head>

	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script>
if (process.client) {
	setWindowHeight();
	setTimeout(() => {
		setWindowHeight();
	}, 1000);
	window.onresize = () => delayedAction(setWindowHeight);

	function setWindowHeight() {
		const windowHeight = window.innerHeight;
		document.documentElement.style.setProperty(
			'--windowHeight',
			`${windowHeight}px`
		);
	}

	let act;

	function delayedAction(action) {
		clearTimeout(act);
		act = setTimeout(() => {
			action();
		}, 200);
	}
}
</script>

<style>
@import './assets/modern-normalize.css';
@import './assets/variables.css';
@import './assets/base.css';
@import './assets/utils.css';
</style>
