<template>
	<slot v-if="!choices.length" />

	<section class="grid">
		<LinkTo
			v-for="choice in choices"
			:key="choice.id"
			:to="`/${choice.id}`"
			class="card"
		>
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

			<LinkTo v-if="props.edit" class="card-edit" :to="'edit' + choice.id">
				✎ Edit
			</LinkTo>
		</LinkTo>
	</section>
</template>

<script setup lang="ts">
const props = defineProps<{
	filter: [string, string | number | number[]];
	open?: boolean;
	edit?: boolean;
}>();
const choices = await useFilteredChoices(props.filter, props.open);
</script>
