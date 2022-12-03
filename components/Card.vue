<template>
	<NuxtLink :to="`/${id}`" class="card">
		<div class="card-images">
			<span
				class="card-image"
				v-for="image in choice.images"
				:style="{ backgroundImage: `url(${image && getSrc(image)})` }"
			></span>
		</div>

		<div class="card-title">
			<small>Help @{{ choice.username }} choose</small>
			<div>{{ choice.title }}</div>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
import { getSrc } from '~/helpers/getSrc';

const props = defineProps<{ id: number }>();
const choice = await useChoice(props.id);
</script>
