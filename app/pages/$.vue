<script setup lang="ts">
const { profile } = useProfile();
const router = useRouter();

watchEffect(() => {
	if (!profile.value) return;
	router.push(PATHS.user + profile.value.username);
});
</script>

<template>
	<h1>Success...</h1>
</template>
