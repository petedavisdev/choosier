<script setup lang="ts">
type UploadInfo = {
	event: string;
	info: {
		delete_token?: string;
		eager?: [
			{
				secure_url: string;
			},
		];
		secure_url: string;
	};
};

type Upload = {
	url: string;
	delete_token: string | undefined;
};

const props = defineProps<{
	folder: string;
	max: number;
}>();

const emit = defineEmits<{ uploaded: [string[]] }>();

const data = reactive({
	uploads: [] as Upload[],
	loading: false,
});

const UPLOAD_CONFIG = {
	cloudName: 'choosier',
	uploadPreset: 'choices',
	folder: props.folder,
	sources: ['local', 'camera', 'url', 'instagram', 'google_drive', 'dropbox'],
	showAdvancedOptions: false,
	cropping: false,
	multiple: true,
	defaultSource: 'local',
	maxFiles: props.max,
	styles: {
		palette: {
			window: '#ffffff',
			sourceBg: '#f4f4f5',
			windowBorder: '#90a0b3',
			tabIcon: '#222222',
			inactiveTabIcon: '#555a5f',
			menuIcons: '#555a5f',
			link: '#222222',
			action: '#339933',
			inProgress: '#333333',
			complete: '#339933',
			error: '#cc0000',
			textDark: '#222222',
			textLight: '#fcfffd',
		},
		fonts: {
			default: null,
			"'Poppins', sans-serif": {
				url: 'https://fonts.googleapis.com/css?family=Poppins',
				active: true,
			},
		},
	},
} as const;

function uploadHandler(error: unknown, info: UploadInfo) {
	data.loading = false;

	if (info?.event === 'success') {
		const url = info.info?.eager?.[0]?.secure_url || info.info?.secure_url;
		data.uploads = [
			...data.uploads,
			{ url, delete_token: info.info?.delete_token },
		];
		updateUploaded();
	}

	if (error) console.error(error);
}

function showUploadWidget() {
	data.loading = true;
	// @ts-expect-error Cloudinary types are not included
	cloudinary.openUploadWidget(UPLOAD_CONFIG, uploadHandler);
}

function deleteUpload(index: number, delete_token: string | undefined) {
	// TODO: Delete from cloudinary
	console.info(delete_token);
	data.uploads.splice(index, 1);
	updateUploaded();
}

function updateUploaded() {
	emit(
		'uploaded',
		data.uploads.map((upload) => upload.url)
	);
}
</script>

<template>
	<Script src="https://widget.cloudinary.com/v2.0/global/all.js" />

	<div v-if="data.uploads.length" :class="$style.thumbnails">
		<div v-for="({ url, delete_token }, index) in data.uploads" :key="index">
			<img :src="url" alt="" />
			<button
				type="button"
				class="close"
				@click.prevent="deleteUpload(index, delete_token)"
			/>
		</div>
	</div>

	<button
		v-if="data.uploads.length < props.max"
		type="button"
		class="button"
		:disabled="data.loading"
		@click="showUploadWidget"
	>
		+ Add images
	</button>
</template>

<style module>
.thumbnails {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 0.5em;
}
</style>
