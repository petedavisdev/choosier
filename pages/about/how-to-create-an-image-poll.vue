<template>
	<Head>
		<Title>How to create an image poll | Choosier</Title>
		<Meta
			name="description"
			content="Creating an image poll with Choosier is quick, easy and free! Start by uploading some images..."
		/>
	</Head>

	<article>
		<h1>How to create an image poll</h1>
		<p>Creating an image poll with Choosier is quick, easy and free!</p>
		<ol>
			<li>Upload between two and ten images.</li>
			<li>
				Add a short title (up to 20 characters) to tell voters what your poll is
				about.
			</li>
			<li>
				Select a category - public polls will appear on the category listing
				page.
			</li>
			<li>
				Decide how long you want the poll to be open for voting - a day or a
				week.
			</li>
			<li>
				Click 'Continue', and when you're happy, click 'Save and publish'.
			</li>
		</ol>
		<p>
			You get 10 free credits when you register on Choosier, so you can start
			experimenting with polls straight away.
		</p>
		<p>Creating a poll requires 1 credit, plus any extras you choose.</p>
		<p>
			You will earn more credits just by inviting new people to vote on your
			polls.
		</p>
		<h2>What are you waiting for?</h2>
		<LinkTo :to="PATHS.new" class="button">+ Create an image poll</LinkTo>
		<p>
			<LinkTo to="./">&larr; About</LinkTo>
		</p>
	</article>
</template>
