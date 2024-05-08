<script setup lang="ts">
const { profile } = useProfile();
</script>

<template>
	<div>
		<template v-if="profile">
			<section class="box" :class="$style.section">
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

			<section class="box" :class="$style.section">
				<h2>My credits</h2>

				<Credits />

				<div>
					<LinkTo :to="PATHS.new" class="button">+ New choice</LinkTo>
				</div>
			</section>

			<section class="box" :class="$style.section">
				<h2>My subscriptions</h2>
				<UserSubscriptions />
			</section>

			<section class="box" :class="$style.section">
				<UserAccount />
			</section>
		</template>
		<UserLogin v-else>
			<h1>Login</h1>
		</UserLogin>
	</div>
</template>

<style module>
.section {
	margin-top: 3em;
}
</style>
