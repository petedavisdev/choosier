<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const runtimeConfig = useRuntimeConfig();

const data = reactive({
	copied: false,
});

const shareLink = runtimeConfig.public.baseUrl + '/' + idToString(props.id);

function copy() {
	try {
		navigator.clipboard.writeText(shareLink);
		data.copied = true;
		setTimeout(() => {
			data.copied = false;
		}, 5000);
	} catch (error) {
		alert(error);
	}
}
</script>

<template>
	{{ shareLink }}
	<br />
	<button @click="copy" type="button" class="button" :disabled="data.copied">
		{{ data.copied ? 'Copied ✓' : 'Copy link' }}
	</button>
</template>
