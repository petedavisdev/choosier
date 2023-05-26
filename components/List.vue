<script setup lang="ts">
const props = defineProps<{
	filter: [string, string | number | number[]];
	open?: boolean;
	edit?: boolean;
}>();
const choices = await useFilteredChoices(props.filter, props.open);
</script>

<template>
	<slot v-if="!choices.length" />

	<section class="grid">
		<LinkTo
			v-for="(choice, index) in choices"
			:key="choice.id"
			:to="idToString(choice.id)"
			class="card"
		>
			<div class="cardImages">
				<img
					class="cardImage"
					v-for="image in choice.images"
					:src="image.replace('h_800', 'h_240')"
					alt=""
					:loading="index > 2 ? 'lazy' : null"
					height="240"
					width="240"
				/>
			</div>

			<div class="cardTitle">
				<small>Help @{{ choice.username }} choose</small>
				<div>{{ choice.title }}</div>
			</div>

			<span v-if="props.edit" class="cardEdit">
				<LinkTo :to="PATHS.edit + idToString(choice.id)"> ✎ Edit </LinkTo>
			</span>
		</LinkTo>
	</section>
</template>
