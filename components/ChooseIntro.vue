<script setup lang="ts">
const props = defineProps<{
	username: string;
	title: string;
}>();

const profile = useProfile();
const data = reactive({
	show: true,
});
</script>

<template>
	<div v-if="data.show" class="backdrop">
		<article class="box">
			<IconLogo />
			<h1>
				<small :class="$style.intro">Help @{{ props.username }} choose</small>
				<div>{{ props.title }}</div>
			</h1>

			<template v-if="!profile.userId.value">
				<h2>How it works:</h2>
				<p>Choosier works like a knockout tournament.</p>
				<ul>
					<li>You will see 2 images at a time</li>
					<li>Keep choosing until you have a winner</li>
				</ul>
			</template>

			<footer class="cen">
				<button
					@click="data.show = false"
					type="button"
					class="button"
					:class="$style.start"
				>
					Start &rarr;
				</button>
			</footer>
		</article>
	</div>
</template>

<style module>
.start {
	margin-top: 2em;
}

.intro {
	font-size: 1rem;
}
</style>
