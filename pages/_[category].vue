<template>
	<div>
		<h1>{{ categories[category] || 'Visual' }} decisions made easy</h1>
		<Categories />

		<article v-if="category === 'art'">
			<h2>Art decisions are hard</h2>
			<p>
				You have endless possibilities with different colours, styles and
				layouts to play with.
			</p>
			<p>
				Choosier helps you make quick visual decisions and involve your audience
				in the process.
			</p>
			<p>
				Choosier shows your images two at a time, like a knock-out tournament,
				to help you pick a favourite.
			</p>
			<p>
				You can share a link with your friends, clients or followers to
				instantly see their favourites and know which artwork is most likely to
				sell.
			</p>
			<h3>No more dithering. No more guesswork.</h3>
		</article>

		<article v-if="category === 'fashion'">
			<h2>Fashion decisions are hard</h2>
			<p>So many styles. So little time.</p>
			<p>
				When you have too many options and too little feedback, you need
				Choosier.
			</p>
			<p>
				Choosier shows your images two at a time, like a knock-out tournament,
				so you can quickly find your favourite.
			</p>
			<p>
				Share with friends, colleagues and followers to instantly see their
				favourites and choose with confidence.
			</p>
			<h3>No more dithering. No more guesswork.</h3>
		</article>

		<article v-if="category === 'graphic-design'">
			<h2>Graphic design decisions are hard</h2>
			<p>
				Brand colours, logo variants, UI styles, layout options, typography… The
				possibilities are endless.
			</p>
			<p>
				When you have too many options and too little feedback, you need
				Choosier.
			</p>
			<p>
				Choosier shows your images two at a time, like a knock-out tournament,
				so you can quickly find your favourite.
			</p>
			<p>
				Share with colleagues, stakeholders or customers to instantly see their
				favourites and choose with confidence.
			</p>
			<h3>No more dithering. No more guesswork.</h3>
		</article>

		<article v-if="category === 'photography'">
			<h2>Photo decisions are hard</h2>
			<ul>
				<li>Choosing a feature image for your blog post...</li>
				<li>Finding your the perfect photo to print...</li>
				<li>Picking your perfect profile pic...</li>
			</ul>
			<p>So many photos, how do you choose the best one?</p>
			<p>Choosier is here to help.</p>
			<p>
				Choosier shows your images two at a time, like a knock-out tournament,
				so you can quickly find your favourite.
			</p>
			<p>
				Share with your friends, family or followers to instantly see their
				favourites and choose with confidence.
			</p>
			<h3>No more dithering. No more guesswork.</h3>
		</article>
	</div>
</template>

<script setup lang="ts">
import { categories } from '~/constants';
const route = useRoute();
const category = route.params.category as string;
</script>
