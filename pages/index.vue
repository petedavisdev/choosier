<template>
	<div>
		<h1>
			<span class="sr-only">Choosier. </span>
			Visual decisions made easy
		</h1>

		<Categories />

		<article>
			<h2>
				Welcome to Choosier, your new favourite way to choose between images.
			</h2>
			<p>
				Choosier shows your images two at a time, like a knock-out tournament,
				to help you pick a favourite.
			</p>

			<p>Share your choice with anyone to help you choose with confidence.</p>

			<h3>Here are some examples:</h3>
		</article>

		<section class="grid">
			<Card :id="1" />
			<Card :id="2" />
		</section>
	</div>
</template>
