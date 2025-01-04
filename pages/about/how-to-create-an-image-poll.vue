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
			<li>Choose to create either a public or private image poll.</li>
			<li>Upload between 2 and 16 images.</li>
			<li>Add a short title to tell voters what your poll is about.</li>
			<li>
				If your poll is public, select a category - your poll will appear on a
				category listing page.
			</li>
			<li>
				Click 'Continue' to check the details and then click 'Save and publish'.
			</li>
		</ol>

		<h2>What are you waiting for?</h2>
		<p>
			<LinkTo :to="PATHS.new" class="button">+ Create an image poll</LinkTo>
		</p>
	</article>

	<p>
		<LinkTo to="./">&uarr; About</LinkTo> |
		<LinkTo to="./how-to-edit-your-image-poll"
			>Edit your image poll &rarr;</LinkTo
		>
	</p>
</template>
