<template>
	<header class="option">
		<img :src="String($attrs.image)" alt="" class="image" />
	</header>

	<section class="option">
		<h1>You have chosen</h1>
		<p>Now please confirm you are human.</p>

		<p class="Field">
			<label for="email">Email</label>
			<input type="email" id="email" name="email" required />
		</p>

		<input hidden name="chosen" :value="$attrs.image" />

		<button class="button">Send me a confirmation link</button>

		<!-- <footer>
			<h3>Privacy first...</h3>
			<ul>
				<li>
					<strong>No spam.</strong> We are only using your email address to send
					the confirmation link. It will not be shared.
				</li>
				<li>
					<strong>Essential cookies only.</strong> The confirmation link sets a
					cookie so that you can continue using Choosier uninterrupted.
					<strong>No trackers. No ads</strong>.
				</li>
			</ul>
		</footer> -->
	</section>
</template>

<style scoped>
.option {
	display: grid;
	place-content: center;
	min-height: 0;
	text-align: center;
}

.option img {
	object-fit: contain;
	min-height: 0;
	max-width: 100%;
	max-height: 100%;
	line-height: 1;
	background-color: white;
}

.Field {
	width: 100%;
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 0.5em;
	align-items: center;
}
</style>
