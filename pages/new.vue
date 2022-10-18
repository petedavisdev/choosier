<template>
	<main>
		<section>
			<h1>We're just getting started</h1>
			<p>While we're beta testing, Chooiser is invite-only.</p>

			<form action="">
				<p class="Field">
					<label for="email">Email</label>
					<input type="email" id="email" name="email" required />
				</p>
				<p class="Field">
					<label for="email">Instagram username (optional)</label>
					<input type="email" id="email" name="email" required />
				</p>
				<button class="button">Join the waiting list</button>
			</form>
		</section>
	</main>
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
});
</script>

<style scoped>
main {
	display: grid;
	min-height: var(--windowHeight);
	place-content: center;
}

.Field {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 0.5em;
}
</style>
