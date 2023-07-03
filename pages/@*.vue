<script setup lang="ts">
const profile = useProfile();
</script>

<template>
	<template v-if="profile.userId.value">
		<h1>Meet the choosers</h1>
		<ProfileList />
	</template>

	<template v-else>
		<h1>Login to meet the choosers</h1>
		<UserLogin />
	</template>
</template>
