<template>
	<div v-if="data.show" class="backdrop">
		<article class="box">
			<IconLogo />
			<h1>
				<small>Help @{{ props.username }} choose</small>
				<div>{{ props.title }}</div>
			</h1>

			<template v-if="!user">
				<h2>How it works:</h2>
				<p>Choosier works like a knockout tournament.</p>
				<ul>
					<li>You will see 2 images at a time</li>
					<li>Keep choosing until you have a winner</li>
				</ul>
			</template>

			<footer class="cen">
				<button @click="data.show = false" class="button" type="button">
					Start &rarr;
				</button>
			</footer>
		</article>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	username: string;
	title: string;
}>();

const user = useSupabaseUser();
const data = reactive({
	show: true,
});
</script>

<style scoped>
footer {
	margin-top: 2em;
}

small {
	font-size: 1rem;
}
</style>
