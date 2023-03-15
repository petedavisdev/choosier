<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const data = reactive({
	copied: false,
});

const shareLink = 'https://choosier.app/' + props.id;

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
