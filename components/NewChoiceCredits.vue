<template>
	<div id="credits" class="backdrop" @click="props.close"></div>
	<section class="box">
		<h2>
			You have {{ props.credits }} credit{{ props.credits === 1 ? '' : 's' }}
		</h2>

		<button @click="props.close" type="button" class="close"></button>

		<p>Hi 👋 I'm Pete. Choosier is my pet project.</p>

		<p>
			In future, you will be able to buy credits and help fund Choosier, but for
			now what I really need is feedback.
		</p>

		<h3>Earn 3 credits by giving feedback</h3>

		<ol>
			<li>
				Follow me on
				<LinkTo to="https://www.instagram.com/choosier.app/" target="_blank"
					>Instagram</LinkTo
				>
				and send me a message.
			</li>

			<li>
				Give me some feedback. Anything you like or dislike about Choosier.
			</li>
			<li>Tell me your choosername.</li>
		</ol>

		<p>
			When I read your message I will give you 3 credits. Please be patient, I
			usually check my messages once a day.
		</p>

		<p>
			<LinkTo
				to="https://www.instagram.com/choosier.app/"
				class="button"
				target="_blank"
				>Follow choosier.app on Instagram
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
