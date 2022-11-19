<template>
	<UserProfile :username="username" />
</template>

<script setup lang="ts">
const route = useRoute();
const username = route.params.username.toString();
</script>
