<template>
	<div>
		<template v-if="user">
			<UserEdit />
			<UserLogout />
		</template>
		<UserLogin v-else />
	</div>
</template>

<script setup>
const user = useSupabaseUser();
</script>
