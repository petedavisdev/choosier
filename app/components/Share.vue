<script setup lang="ts">
const props = defineProps<{
	id: number;
	uuid?: string;
}>();

const data = reactive({
	copied: '',
	shareImages: '',
});

let shareLink = useRuntimeConfig().public.siteUrl + '/' + props.id;
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
		<p v-if="props.uuid">
			Here is your private link. Share it with people you trust.
		</p>

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
			@click="data.shareImages = 'instagram'"
		>
			Instagram
		</button>
		<!-- <button
			v-if="!props.uuid"
			type="button"
			class="button"
			@click="data.shareImages = 'reddit'"
		>
			Reddit
		</button> -->
	</div>

	<aside
		v-if="data.shareImages"
		class="backdrop"
		@click.self="data.shareImages = ''"
	>
		<div class="box" :class="$style.instagram">
			<button
				type="button"
				class="close"
				@click="data.shareImages = ''"
			></button>
			<LazyShareInstagram
				v-if="data.shareImages === 'instagram'"
				:id="props.id"
				:share-link="shareLink"
			/>
			<!-- <LazyShareReddit
				v-if="data.shareImages === 'reddit'"
				:id="props.id"
				:share-link="shareLink"
			/> -->
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
