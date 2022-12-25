<template>
	<div id="credits" class="backdrop" @click="props.close"></div>
	<section class="box">
		<h2>
			You have {{ props.credits }} credit{{ props.credits === 1 ? '' : 's' }}
		</h2>

		<button @click="props.close" type="button" class="close"></button>

		<h3>Earn 3 credits by giving feedback</h3>

		<p>
			Follow choosier.app on
			<LinkTo to="https://www.instagram.com/choosier.app/" target="_blank"
				>Instagram ↗</LinkTo
			>
			and send me a message.
		</p>

		<p>Give me some feedback. Anything good or bad about Choosier.</p>

		<p>
			When I read your message I will give you 3 credits. Please be patient, I
			usually check my messages once a day.
		</p>

		<p>
			<LinkTo
				to="https://www.instagram.com/choosier.app/"
				class="button"
				target="_blank"
				>Follow choosier.app on Instagram ↗
			</LinkTo>
		</p>
	</section>
	<!-- </div> -->
</template>

<script setup lang="ts">
const props = defineProps<{
	credits: number;
	close: () => void;
}>();
</script>

<style scoped>
.box {
	position: absolute;
	z-index: 1;
}
</style>
