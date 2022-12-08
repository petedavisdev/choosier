<template>
	<Head>
		<Script
			src="https://widget.cloudinary.com/v2.0/global/all.js"
			type="text/javascript"
		/>
	</Head>
	<button @click="showUploadWidget" class="button">Upload</button>
</template>

<script setup>
function showUploadWidget() {
	cloudinary.openUploadWidget(
		{
			cloudName: 'choosier',
			uploadPreset: 'choices',
			sources: [
				'local',
				'camera',
				'url',
				'instagram',
				'google_drive',
				'dropbox',
			],
			googleApiKey: '<image_search_google_api_key>',
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
		},
		(err, info) => {
			if (!err) {
				console.log('Upload Widget event - ', info);
			}
		}
	);
}
</script>
