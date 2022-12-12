<template>
	<NuxtLink :to="`/${id}`" class="card">
		<div class="card-images">
			<img
				class="card-image"
				v-for="image in choice.images"
				:src="image"
				alt=""
				loading="lazy"
				height="800"
				width="800"
			/>
		</div>

		<div class="card-title">
			<small>Help @{{ choice.username }} choose</small>
			<div>{{ choice.title }}</div>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{ id: number }>();
const choice = await useChoice(props.id);
</script>
