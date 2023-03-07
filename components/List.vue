<template>
	<slot v-if="!choices.length" />

	<section class="grid">
		<LinkTo
			v-for="choice in choices"
			:key="choice.id"
			:to="`/${choice.id}`"
			class="card"
		>
			<div class="cardImages">
				<img
					class="cardImage"
					v-for="image in choice.images"
					:src="image.replace('h_800', 'h_240')"
					alt=""
					loading="lazy"
					height="320"
					width="320"
				/>
			</div>

			<div class="cardTitle">
				<small>Help @{{ choice.username }} choose</small>
				<div>{{ choice.title }}</div>
			</div>

			<LinkTo v-if="props.edit" class="cardEdit" :to="'edit' + choice.id">
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
