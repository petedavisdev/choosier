<template>
	<div id="credits" class="backdrop" @click="props.close"></div>
	<section class="box">
		<h2>
			You have {{ props.credits }} credit{{ props.credits === 1 ? '' : 's' }}
		</h2>

		<button @click="props.close" type="button" class="close"></button>

		<h3>Earn 2 credits by giving feedback</h3>

		<ol>
			<li>
				Follow me on
				<a
					href="https://www.instagram.com/choosier.app/"
					target="_blank"
					rel="noopener noreferrer"
					>Instagram</a
				>
				and send me a message.
			</li>

			<li>Tell me what you like or dislike about Choosier.</li>
			<li>Tell me your choosername.</li>
		</ol>

		<p>
			When I read your message I will give you 2 credits. Please be patient, I
			usually check my messages once a day.
		</p>

		<p>
			<a
				href="https://www.instagram.com/choosier.app/"
				class="button"
				target="_blank"
				rel="noopener noreferrer"
				>Follow choosier.app on Instagram</a
			>
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
