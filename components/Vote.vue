<template>
	<header>
		<img :src="String($attrs.image)" alt="" class="image" />
	</header>

	<section>
		<h1>You have chosen</h1>
		<p>To vote, please confirm that you're human</p>
		<label for="email">Email</label>
		<input type="email" id="email" name="email" required />
		<input disabled name="chosen" :value="$attrs.image" />
		<button>Send me an email</button>
	</section>
</template>
