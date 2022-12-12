<template>
	<div>
		<h1>{{ categories[category] || 'Visual' }} decisions made easy</h1>
		<Categories />

		<template v-if="category === 'art'">
			<Head>
				<Title>Choosier. Art and illustration decisions made easy</Title>
				<Meta
					name="description"
					content="Get help choosing colors, styles and layouts for your artwork. Use Choosier to poll your friends, followers and clients so that you can choose with confidence."
				/>
			</Head>

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
				to help you pick a favorite.
			</p>
			<p>
				You can share a link with your friends, clients or followers to
				instantly see their favorites and know which artwork is most likely to
				sell.
			</p>
			<h3>No more dithering.</h3>
			<h3>No more guesswork.</h3>
		</template>

		<template v-if="category === 'fashion'">
			<Head>
				<Title>Choosier. Fashion and costume decisions made easy</Title>
				<Meta
					name="description"
					content="Get help choosing the right styles, materials and combinations for the perfect outfit. Use Choosier to poll your friends and choose with confidence."
				/>
			</Head>

			<h2>Fashion decisions are hard</h2>
			<p>So many styles. So little time.</p>
			<p>
				Whether you are designing clothes, putting together the perfect outfit
				or coming up with costume ideas, Choosier is here to help.
			</p>
			<p>
				Choosier shows your images two at a time, like a knock-out tournament,
				so you can quickly find your favorite.
			</p>
			<p>
				Share with friends, colleagues and followers to instantly see their
				favorites and choose with confidence.
			</p>
			<h3>No more dithering.</h3>
			<h3>No more guesswork.</h3>
		</template>

		<template v-if="category === 'graphic-design'">
			<Head>
				<Title>Choosier. Graphic design decisions made easy</Title>
				<Meta
					name="description"
					content="Get help choosing between brand colours, typography, logos designs, UI styles. Use Choosier to poll your colleagues and customers to make informed decisions."
				/>
			</Head>

			<h2>Graphic design decisions are hard</h2>
			<p>
				Brand colors, logo variants, UI styles, layout options, typography… The
				possibilities are endless.
			</p>
			<p>
				When you have too many options and too little feedback, you need
				Choosier.
			</p>
			<p>
				Choosier shows your images two at a time, like a knock-out tournament,
				so you can quickly find your favorite.
			</p>
			<p>
				Share with colleagues, stakeholders or customers to instantly see their
				favorites and choose with confidence.
			</p>
			<h3>No more dithering.</h3>
			<h3>No more guesswork.</h3>
		</template>

		<template v-if="category === 'photography'">
			<Head>
				<Title>Choosier. Photo decisions made easy</Title>
				<Meta
					name="description"
					content="Get help choosing the perfect photo to print, feature on your blog or use as your profile picture. Use Choosier to poll your friends, followers and clients."
				/>
			</Head>

			<h2>Photo decisions are hard</h2>
			<ul>
				<li>Choosing a feature image for your blog post...</li>
				<li>Finding your the perfect photo to print...</li>
				<li>Picking your perfect profile picture...</li>
			</ul>
			<p>So many photos, how do you choose the best one?</p>
			<p>Choosier is here to help.</p>
			<p>
				Choosier shows your images two at a time, like a knock-out tournament,
				so you can quickly find your favorite.
			</p>
			<p>
				Share with your friends, family or followers to instantly see their
				favorites and choose with confidence.
			</p>
			<h3>No more dithering.</h3>
			<h3>No more guesswork.</h3>

			<h2>Here is an example:</h2>
			<section class="grid">
				<Card :id="2" />
			</section>
		</template>

		<NuxtLink to="/new" class="button">+ Make your own choice</NuxtLink>
	</div>
</template>

<script setup lang="ts">
import { categories } from '~/constants';
const route = useRoute();
const category = route.params.category as string;
</script>
