<script setup lang="ts">
const { profile } = useProfile();
</script>

<template>
	<div v-if="profile" class="grid">
		<section class="box" :class="$style.profile">
			<h2>My profile</h2>
			<UserEdit show-website>
				<label for="username">My choosername</label>
			</UserEdit>
		</section>

		<!-- TODO:
			<section class="box" :class="$style.section">
				<UserAvatarUpload />
			</section>
 -->

		<section class="box" :class="$style.credits">
			<h2>My credits</h2>

			<Credits />
			<p>
				<LinkTo :to="PATHS.credits" class="button">
					&uarr; Top up credits
				</LinkTo>
			</p>
		</section>

		<section class="box" :class="$style.subscriptions">
			<h2>My subscriptions</h2>
			<UserSubscriptions />
		</section>

		<section class="box" :class="$style.account">
			<h2>My account</h2>
			<UserAccount />
		</section>
	</div>

	<UserLogin v-else>
		<h1>Login</h1>
	</UserLogin>
</template>

<style module>
.profile {
	background-color: var(--green);
}

.credits {
	background-color: var(--yellow);
}

.subscriptions {
	background-color: var(--peach);
}

.account {
	background-color: var(--blue);
}
</style>
