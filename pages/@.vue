<script setup lang="ts">
const profile = useProfile();
</script>

<template>
	<div>
		<template v-if="profile.userId.value" class="box">
			<section class="box" :class="$style.section">
				<h2>My profile</h2>
				<UserEdit show-website>
					<label for="username">My choosername</label>
				</UserEdit>
			</section>

			<!-- TODO:
			<section class="box" :class="$style.section">
				<UserAvatar />
			</section>
 -->
			<section class="box" :class="$style.section">
				<h2>My subscriptions</h2>
				<UserSubscriptions />
			</section>

			<section class="box" :class="$style.section">
				<h2>My account</h2>
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
