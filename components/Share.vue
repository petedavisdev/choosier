<script setup lang="ts">
const props = defineProps<{
	id: number;
}>();

const data = reactive({
	copied: '',
});

const shareLink = useRuntimeConfig().public.baseUrl + '/' + props.id;
const embedCode = `<iframe src="${shareLink}" frameborder="0" style="height: calc(90dvh - 2rem); width: 100%"></iframe>`;

function copy(text: string) {
	try {
		navigator.clipboard.writeText(text);
		data.copied = text;
		setTimeout(() => {
			data.copied = '';
		}, 3000);
	} catch (error) {
		alert(error);
	}
}
</script>

<template>
	<div :class="$style.share">
		<h3 @click="copy(shareLink)">{{ shareLink }}</h3>
		<button
			@click="copy(shareLink)"
			type="button"
			class="button"
			:disabled="data.copied === shareLink"
		>
			{{ data.copied === shareLink ? 'Copied ✓' : 'Copy link' }}
		</button>

		<button
			@click="copy(embedCode)"
			type="button"
			class="button"
			:disabled="data.copied === embedCode"
		>
			{{
				data.copied === embedCode ? 'Copied embed code ✓' : 'Copy embed code'
			}}
		</button>
	</div>
</template>

<style module>
.share {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;
	align-items: center;
}
</style>
