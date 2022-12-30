<template>
	<nav>
		<span v-for="(category, key) in categories" key="key">
			<LinkTo :to="'/_' + key">{{ key.replace('-', ' ') }}</LinkTo>
		</span>
	</nav>
</template>

<script setup lang="ts">
import { categories } from '~~/constants';
</script>

<style scoped>
nav {
	display: flex;
	gap: 1em;
	flex-wrap: wrap;
	margin-bottom: 3em;
	text-transform: capitalize;
}
</style>
