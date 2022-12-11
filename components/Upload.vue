<template>
	<button @click="showUploadWidget" type="button" class="button">Upload</button>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'uploaded', value: string): void }>();

const data = reactive({
	images: [] as string[],
});

interface UploadInfo {
	event: string;
	info: {
		eager: [
			{
				secure_url: string;
			}
		];
		secure_url: string;
	};
}

const uploadConfig = {
	cloudName: 'choosier',
	uploadPreset: 'choices',
	sources: ['local', 'camera', 'url', 'instagram', 'google_drive', 'dropbox'],
	showAdvancedOptions: false,
	cropping: false,
	multiple: true,
	defaultSource: 'local',
	styles: {
		palette: {
			window: '#ffffff',
			sourceBg: '#f4f4f5',
			windowBorder: '#90a0b3',
			tabIcon: '#000000',
			inactiveTabIcon: '#555a5f',
			menuIcons: '#555a5f',
			link: '#222222',
			action: '#339933',
			inProgress: '#333333',
			complete: '#339933',
			error: '#cc0000',
			textDark: '#000000',
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
};

function uploadHandler(error: unknown, info: UploadInfo) {
	if (info?.event === 'success') {
		const url = info.info?.eager[0]?.secure_url || info.info?.secure_url;
		emit('uploaded', url);
	}

	if (error) console.error(error);
}

function showUploadWidget() {
	// @ts-ignore
	cloudinary.openUploadWidget(uploadConfig, uploadHandler);
}
</script>
