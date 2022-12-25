<template>
	<div>
		<template v-if="user">
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
		<p>
			<LinkTo to="/">&larr; Choosier homepage</LinkTo>
		</p>
	</div>
</template>

<script setup>
const user = useSupabaseUser();
</script>
