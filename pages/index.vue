<template>
	<div>
		<h1>
			<span class="sr-only">Choosier. </span>
			Visual decisions made easy
		</h1>

		<Categories />

		<section class="grid">
			<Card :id="2" />
		</section>

		<article>
			<h2>How Choosier Works</h2>
			<p>When you have too many options, Choosier is here to help.</p>
			<p>
				It shows your images two at a time, like a knock-out tournament, so you
				can make quick comparisons and find your favorite.
			</p>
			<p>
				Share your choice with friends, followers, colleagues or customers to
				instantly see their favorites and choose with confidence.
			</p>
			<h3>
				No more dithering.
				<br />
				No more guesswork.
			</h3>
		</article>

		<LinkTo to="/new" class="button">+ Make your own choice</LinkTo>
	</div>
</template>
