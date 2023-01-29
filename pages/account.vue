<template>
	<div>
		<template v-if="profile.userId.value" class="box">
			<div class="box">
				<h2>My profile</h2>
				<UserEdit show-website>
					<label for="username">My choosername</label>
				</UserEdit>
			</div>

			<div class="box">
				<h2>My subscriptions</h2>
				<UserSubscriptions />
			</div>

			<div class="box">
				<h2>My account</h2>
				<UserAccount />
			</div>
		</template>
		<UserLogin v-else>
			<h1>Login</h1>
		</UserLogin>
	</div>
</template>

<script setup>
const profile = useProfile();
</script>

<style scoped>
.box {
	margin-top: 3em;
}
</style>
