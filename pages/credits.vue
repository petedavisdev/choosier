<template>
	<div>
		<h1>Credits</h1>
		<h3>
			You have {{ profile.credits }} credit{{
				profile.credits === 1 ? '' : 's'
			}}
		</h3>

		<p>
			Hi, I'm Pete. Chooiser is my pet project and I really appreciate your
			support.
		</p>

		<p>
			I have given you 1 credit to get started. Here is how you can get more.
		</p>

		<div class="columns">
			<section class="box">
				<h3>Give me feedback to earn 2 credits</h3>

				<ol>
					<li>
						Follow me on
						<NuxtLink to="https://www.instagram.com/choosier.app/"
							>Instagram.</NuxtLink
						>
						and send me a message.
					</li>

					<li>Tell me what you like or dislike about Choosier.</li>
					<li>Tell me your choosername.</li>
				</ol>

				<p>When I read the message I will give you 2 more credits</p>

				<p>
					<NuxtLink to="https://www.instagram.com/choosier.app/" class="button"
						>Follow choosier.app on Instagram</NuxtLink
					>
				</p>
			</section>

			<section class="box">
				<h3>Buy me a coffee to get 5 credits</h3>
				<p>Give me some extra motivation to keep working on Choosier.</p>
				<p>I will give you 5 credits for every coffee.</p>

				<p>
					<NuxtLink to="https://www.buymeacoffee.com/petedavis" class="button"
						>☕️ Buy me a coffee</NuxtLink
					>
				</p>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
const profile = await useMyProfile();
</script>

<style scoped>
@media (min-width: 1000px) {
	.columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3em;
	}
}
</style>
