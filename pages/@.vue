<template>
	<div>
		<template v-if="user">
			<UserEdit />
			<UserLogout />
		</template>
		<UserLogin v-else>
			<h1>Login</h1>
		</UserLogin>
	</div>
</template>

<script setup>
const user = useSupabaseUser();
</script>
