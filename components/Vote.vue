<template>
	<header class="option">
		<img :src="String($attrs.image)" alt="" class="image" />
	</header>

	<section class="option">
		<h1>You have chosen</h1>
		<p>To count your choice, we need to confirm that you're human!</p>
		<label for="email">Email</label>
		<input type="email" id="email" name="email" required />
		<input hidden name="chosen" :value="$attrs.image" />
		<button>Send me a confirmation link</button>
		<p>Your email address is not being added to a mailing list or shared.</p>
		<p>
			The confirmation link sets a cookie so that you can continue using
			Choosier.
		</p>
		<p>We only have essential cookies. No trackers. No ads.</p>
	</section>
</template>
