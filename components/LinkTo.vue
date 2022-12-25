<template>
	<NuxtLink v-if="inFrame" :to="to" :class="class" target="_parent">
		<slot />
	</NuxtLink>

	<NuxtLink v-else-if="target" :to="to" :class="class" :target="target">
		<slot />
	</NuxtLink>

	<NuxtLink v-else :to="to" :class="class">
		<slot />
	</NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
	to: string;
	class?: string;
	target?: string;
}>();

onMounted(() => {
	const inFrame = window?.frameElement;
});
</script>
