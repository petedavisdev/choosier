<template>
	<main>
		<form class="box" action="">
			<Logo class="Logo" />
			<h1>You're early!</h1>
			<p>While we're beta testing, adding new choices is invite-only.</p>

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
	align-items: center;
}

footer {
	text-align: right;
}
</style>
