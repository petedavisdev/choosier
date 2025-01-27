<script setup lang="ts">
const props = defineProps<{
	filter: [string, string | number | number[]];
	open?: boolean;
	minVotes?: number;
	edit?: boolean;
	allowPrivate?: boolean;
}>();
const choices = await useFilteredChoices(
	props.filter,
	props.open,
	props.allowPrivate
);
</script>

<template>
	<slot v-if="!choices.length" />

	<section class="grid">
		<LinkTo
			v-for="(choice, index) in choices"
			:key="choice.id"
			:to="
				choice.visibility === 'private'
					? choice.id + '?uuid=' + choice.uuid
					: choice.id
			"
			class="card"
			data-cy="choice"
		>
			<div class="cardImages">
				<NuxtImg
					class="cardImage"
					:src="useCover(choice.id)"
					alt=""
					:loading="index > 2 ? 'lazy' : undefined"
					height="210"
					width="400"
					format="webp"
					quality="80"
				/>
			</div>

			<div
				v-if="choice.visibility === 'private'"
				class="cardImages"
				:class="$style.lockBackdrop"
			>
				<IconLock :class="$style.lockIcon" />
			</div>

			<div class="cardTitle">
				<small>Help {{ choice.username }} choose</small>
				<div>{{ choice.title }}</div>
			</div>

			<LinkTo v-if="props.edit" class="cardEdit" :to="PATHS.new + choice.id">
				<IconSettings class="cardEditIcon" />
			</LinkTo>
		</LinkTo>
	</section>
</template>

<style module>
.lockBackdrop {
	display: grid;
	place-items: center;
	background-color: var(--dark);
	opacity: 0.8;
}
.lockIcon {
	height: 8rem;
	width: 6rem;
	padding-bottom: 3rem;
	color: var(--lightest);
}
</style>
