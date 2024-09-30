<script setup lang="ts">
const props = defineProps<{
	username: string;
	title: string;
	votingSystem: string;
}>();

const { profile } = useProfile();
const data = reactive({
	show: true,
});
</script>

<template>
	<div v-if="data.show" class="backdrop">
		<article class="box center">
			<IconLogo />
			<h1>
				<small :class="$style.intro">Help {{ props.username }} choose</small>
				<div>{{ props.title }}</div>
			</h1>

			<template v-if="!profile">
				<p>You will see 2 images at a time.</p>
				<p>
					Just keep choosing to find your
					{{ props.votingSystem === '1' ? 'winner' : 'top 2' }}!
				</p>
			</template>

			<button
				type="button"
				class="button"
				data-cy="start"
				@click="data.show = false"
			>
				Start choosing &rarr;
			</button>
		</article>
	</div>
</template>

<style module>
.intro {
	font-size: 1rem;
}
</style>
