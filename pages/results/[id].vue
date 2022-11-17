<template>
	<div class="cen">
		<h1>
			<small>You helped Fithacker choose</small>
			Logo colors
		</h1>
		<p>Here are the results so far</p>
		<Results :id="(route.params.id as string)" />
	</div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style>
small {
	display: block;
	font-size: 1rem;
}
</style>
