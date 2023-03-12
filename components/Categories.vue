<script setup lang="ts">
import { categories } from '~/constants';
</script>

<template>
	<nav :class="$style.categories">
		<template v-for="(category, key) in categories" key="key">
			<LinkTo :to="'/_' + key" :class="$style.link">{{
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
