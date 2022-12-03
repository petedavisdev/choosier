<template>
	<div class="card">
		<div class="card-images">
			<span
				class="card-image"
				v-for="image in props.images"
				:style="{ backgroundImage: `url(${image && getSrc(image)})` }"
			></span>
		</div>

		<div class="card-title">
			<small>Help @{{ props.username }} choose</small>
			<div>{{ props.title || 'No title' }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getSrc } from '~/helpers/getSrc';

const props = defineProps<{
	images: string[];
	title: string;
	username: string;
}>();
</script>
