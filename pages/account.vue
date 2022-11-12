<template>
	<div>
		<Account v-if="user" />
		<Auth v-else />
	</div>
</template>

<script setup>
const user = useSupabaseUser();
</script>
