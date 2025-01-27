<script setup lang="ts">
const props = defineProps<{
	to: string | number;
	class?: string;
	target?: string;
}>();

const inFrame = ref(false);

const classes = props.class ? [...props.class.split(' ')] : [];

onMounted(() => {
	inFrame.value = Boolean(window?.frameElement);
});
</script>

<template>
	<NuxtLink v-if="inFrame" :to="`${to}`" :class="classes" target="_parent">
		<slot />
	</NuxtLink>

	<NuxtLink v-else-if="target" :to="`${to}`" :class="classes" :target="target">
		<slot />
	</NuxtLink>

	<NuxtLink v-else :to="`${to}`" :class="classes">
		<slot />
	</NuxtLink>
</template>
