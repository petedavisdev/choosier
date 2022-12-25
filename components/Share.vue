<template>
	{{ shareLink }}
	<br />
	<button @click="copy" type="button" class="button">Copy link</button>
</template>

<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const shareLink = 'https://choosier.app/' + props.id;

function copy() {
	try {
		navigator.clipboard.writeText(shareLink);
	} catch (error) {
		alert(error);
	}
}
</script>

<style scoped>
.button {
	margin-bottom: 1em;
}
</style>
