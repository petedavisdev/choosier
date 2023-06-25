<script setup lang="ts">
const props = defineProps<{
	to: string | number;
	class?: string;
	target?: string;
}>();

const data = reactive({
	inFrame: false,
});

onMounted(() => {
	data.inFrame = Boolean(window?.frameElement);
});
</script>

<template>
	<NuxtLink v-if="data.inFrame" :to="`${to}`" :class="class" target="_parent">
		<slot />
	</NuxtLink>

	<NuxtLink v-else-if="target" :to="`${to}`" :class="class" :target="target">
		<slot />
	</NuxtLink>

	<NuxtLink v-else :to="`${to}`" :class="class">
		<slot />
	</NuxtLink>
</template>
