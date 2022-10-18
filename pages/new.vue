<template>
	<main>
		<section>
			<Logo class="Logo" />
			<h1>We're just getting started</h1>
			<p>While we're beta testing, adding new choices is invite-only.</p>

			<form action="">
				<p class="Field">
					<label for="email">Email *</label>
					<input type="email" id="email" name="email" required />
				</p>
				<p class="Field">
					<label for="instagram">Instagram username</label>
					<input id="instagram" name="instagram" required />
				</p>
				<footer>
					<button class="button">Join the waiting list</button>
				</footer>
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
	padding: 2em;
}

.Field {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 0.5em;
	align-items: baseline;
}

footer {
	text-align: right;
}
</style>
