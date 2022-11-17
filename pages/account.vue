<template>
	<div>
		<UserAccount v-if="user" />
		<UserLogin v-else />
	</div>
</template>

<script setup>
const user = useSupabaseUser();
</script>
