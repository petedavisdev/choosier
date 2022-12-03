<template>
	<div>
		<h1>{{ categories[category] || 'Visual' }} decisions made easy</h1>
		<Categories />
	</div>
</template>

<script setup lang="ts">
import { categories } from '~/constants';
const route = useRoute();
const category = route.params.category as string;
</script>
