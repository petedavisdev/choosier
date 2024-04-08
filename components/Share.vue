<script setup lang="ts">
const props = defineProps<{
	id: number;
	uuid?: string;
}>();

const data = reactive({
	copied: '',
});

let shareLink = useRuntimeConfig().public.baseUrl + '/' + props.id;
if (props.uuid) shareLink += '?uuid=' + props.uuid;
const embedCode = `<iframe src="${shareLink}" frameborder="0" style="height: calc(90svh - 2rem); width: 100%"></iframe>`;

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
			type="button"
			class="button"
			:disabled="data.copied === shareLink"
			@click="copy(shareLink)"
		>
			{{ data.copied === shareLink ? 'Copied ✓' : 'Copy link' }}
		</button>

		<button
			v-if="!props.uuid"
			type="button"
			class="button"
			:disabled="data.copied === embedCode"
			@click="copy(embedCode)"
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
