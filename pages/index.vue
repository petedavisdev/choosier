<template>
	<div>
		<h1>
			<span class="sr-only">Choosier. </span>
			Visual decisions made easy
		</h1>

		<Categories />

		<section class="grid">
			<Card :id="1" />
			<Card :id="2" />
		</section>

		<article>
			<h2>How Choosier Works</h2>
			<p>
				Choosier shows your images two at a time, like a knock-out tournament,
				so you can make quick comparisons and find your favorite.
			</p>
			<p>
				Share your choice with friends, followers, colleagues or customers to
				instantly see their favorites and choose with confidence.
			</p>
			<h3>No more dithering. No more guesswork.</h3>
		</article>

		<NuxtLink to="/new" class="button">+ Make your own choice</NuxtLink>
	</div>
</template>
