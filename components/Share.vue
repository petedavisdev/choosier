<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const runtimeConfig = useRuntimeConfig();

const data = reactive({
	copied: false,
});

const shareLink = runtimeConfig.public.baseUrl + '/' + props.id;

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

	<div>
		<p>Embed code</p>
		<code>
			<iframe
				:src="shareLink"
				frameborder="0"
				style="height: calc(90dvh - 2rem); width: 100%"
			>
			</iframe
		></code>
	</div>
</template>
