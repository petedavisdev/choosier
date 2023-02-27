<template>
	<h1>Say hello</h1>

	<section>
		<p>Hi 👋 I'm Pete</p>
		<p>Choosier is my pet project and still in beta.</p>
		<p>
			I love to receive feedback and bug reports, but please be patient if I
			don't get back to you straight away.
		</p>
	</section>

	<form action="https://formspree.io/f/mzbqgzvz" method="POST">
		<label>
			Your email:
			<input type="email" name="email" required />
		</label>
		<label>
			Your message:
			<textarea name="message" required rows="6"></textarea>
		</label>
		<p>
			<button type="submit" class="button">Send</button>
		</p>
	</form>
</template>

<style>
form {
	display: grid;
	gap: 1em;
}

input,
textarea {
	display: block;
	width: min(100%, 800px);
}
</style>
