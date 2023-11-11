<script setup lang="ts">
const props = defineProps<{
	filter: [string, string | number | number[]];
	open?: boolean;
	minVotes?: number;
	edit?: boolean;
}>();
const choices = await useFilteredChoices(
	props.filter,
	props.open,
	props.minVotes
);
</script>

<template>
	<slot v-if="!choices.length" />

	<section class="grid">
		<LinkTo
			v-for="(choice, index) in choices"
			:key="choice.id"
			:to="choice.id"
			class="card"
		>
			<div class="cardImages">
				<img
					class="cardImage"
					:src="useCover(choice.id)"
					alt=""
					:loading="index > 2 ? 'lazy' : null"
					height="210"
					width="400"
				/>
			</div>

			<div class="cardTitle">
				<small>Help {{ choice.username }} choose</small>
				<div>{{ choice.title }}</div>
			</div>

			<span v-if="props.edit" class="cardEdit">
				<LinkTo :to="PATHS.new + choice.id"> ✎ Edit </LinkTo>
			</span>
		</LinkTo>
	</section>
</template>
