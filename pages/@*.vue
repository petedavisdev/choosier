<script setup lang="ts">
const { profile } = useProfile();
</script>

<template>
	<div v-if="profile">
		<h1>Meet the choosers</h1>
		<ProfileList />
	</div>

	<div v-else>
		<h1>Login to meet the choosers</h1>
		<UserLogin />
	</div>
</template>
