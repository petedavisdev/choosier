<script setup lang="ts">
const props = defineProps<{
	id: number;
	uuid?: string;
}>();

const data = reactive({
	copied: '',
	isInstagramOpen: false,
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
		<h3 :class="$style.copy" @click="copy(shareLink)">{{ shareLink }}</h3>
		<button
			type="button"
			class="button"
			:class="$style.copy"
			:disabled="data.copied === shareLink"
			@click="copy(shareLink)"
		>
			{{ data.copied === shareLink ? 'Copied ✓' : 'Copy link' }}
		</button>

		<button
			v-if="!props.uuid"
			type="button"
			class="button"
			:class="$style.copy"
			:disabled="data.copied === embedCode"
			@click="copy(embedCode)"
		>
			{{
				data.copied === embedCode ? 'Copied embed code ✓' : 'Copy embed code'
			}}
		</button>

		<button
			v-if="!props.uuid"
			type="button"
			class="button"
			@click="data.isInstagramOpen = true"
		>
			Share on Instagram
		</button>
	</div>

	<aside
		v-if="data.isInstagramOpen"
		class="backdrop"
		@click.self="data.isInstagramOpen = false"
	>
		<div class="box" :class="$style.instagram">
			<button
				type="button"
				class="close"
				@click="data.isInstagramOpen = false"
			></button>
			<LazyShareInstagram :id="props.id" :share-link="shareLink" />
		</div>
	</aside>
</template>

<style module>
.share {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;
	align-items: center;
}

.copy {
	cursor: copy;
}

.instagram {
	min-width: 368px;
	height: calc(100svh - 2rem);
	overflow-y: auto;
	overflow-x: hidden;
}
</style>
