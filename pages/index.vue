<template>
	<div>
		<h1>
			<span class="sr-only">Choosier. </span>
			Visual decisions made easy
		</h1>

		<Categories />

		<h2>Examples:</h2>

		<section class="grid">
			<Card :id="1" />
			<Card :id="2" />
		</section>
	</div>
</template>
