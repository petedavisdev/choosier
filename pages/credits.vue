<template>
	<article>
		<h1 v-if="profile.userId.value">
			You have <strong>{{ profile.credits.value }}</strong> credit{{
				profile.credits.value === 1 ? '' : 's'
			}}
		</h1>
		<h1 v-else>Credits</h1>

		<p>It is free to create choices on Choosier.</p>
		<p>Credits are for bonus features:</p>

		<ul>
			<li>Extra images: 2 credits</li>
			<li>Extended voting time: 2 credits</li>
			<li>Promoted choices: 2 credits</li>
			<li>Private choices: 5 credits (coming soon...)</li>
		</ul>

		<p>You can buy and earn credits.</p>
		<div class="grid">
			<CreditsBuy />
			<CreditsEarn />
		</div>

		<p v-if="profile.userId.value">
			So far you have bought
			{{ profile.credits.value - profile.recruits.value?.length }}, earned
			{{ profile.recruits.value?.length }}, and used
			{{ profile.creditsUsed.value }} credits.
		</p>

		<h2>Funding Choosier</h2>
		<p>
			We are committed to keeping Choosier free to use, with no ads and never
			selling your data.
		</p>
		<p>
			Selling credits allows us to fund Choosier's development and hosting while
			prioritizing your chooser experience.
		</p>
		<p>Thank you for your support!</p>
	</article>
</template>

<script setup lang="ts">
const profile = useProfile();
</script>

<style scoped>
.button {
	margin-bottom: 1em;
}
</style>
