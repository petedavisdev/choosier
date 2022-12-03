<template>
	<nav>
		<span v-for="(category, key) in categories" key="key">
			<NuxtLink v-if="key !== 'other'" :to="'/_' + key">{{
				key.replace('-', ' ')
			}}</NuxtLink>
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
