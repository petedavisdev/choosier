<template>
	<nav :class="$style.categories">
		<LinkTo :to="PATHS.home" :class="$style.link">Featured</LinkTo>

		<template v-for="(category, key) in CATEGORIES" :key="key">
			<LinkTo
				:to="PATHS.category + key"
				:class="$style.link"
				data-cy="categories-nav-item"
				>{{ key.replace('-', ' ') }}</LinkTo
			>
		</template>
	</nav>
</template>

<style module>
.categories {
	display: flex;
	gap: 1em;
	flex-wrap: wrap;
	margin-bottom: 2em;
	text-transform: capitalize;
	line-height: 1;
}
</style>
