<template>
	<div>
		<template v-if="profile.userId.value">
			<h2>My profile</h2>
			<UserEdit show-website>
				<label for="username">My choosername</label>
			</UserEdit>
			<br />
			<h2>My account</h2>
			<UserAccount />
		</template>
		<UserLogin v-else>
			<h1>Login</h1>
		</UserLogin>
	</div>
</template>

<script setup>
const profile = useProfile();
</script>
