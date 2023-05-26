<template>
	<nav :class="$style.categories">
		<template v-for="(category, key) in CATEGORIES" key="key">
			<LinkTo :to="PATHS.category + key" :class="$style.link">{{
				key.replace('-', ' ')
			}}</LinkTo>
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
}
</style>
