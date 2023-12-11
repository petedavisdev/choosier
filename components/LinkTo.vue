<script setup lang="ts">
const props = defineProps<{
	to: string | number;
	class?: string;
	target?: string;
}>();

const data = reactive({
	inFrame: false,
});

const classes = props.class ? [...props.class.split(' ')] : [];

onMounted(() => {
	data.inFrame = Boolean(window?.frameElement);
});
</script>

<template>
	<NuxtLink v-if="data.inFrame" :to="`${to}`" :class="classes" target="_parent">
		<slot />
	</NuxtLink>

	<NuxtLink v-else-if="target" :to="`${to}`" :class="classes" :target="target">
		<slot />
	</NuxtLink>

	<NuxtLink v-else :to="`${to}`" :class="classes">
		<slot />
	</NuxtLink>
</template>
