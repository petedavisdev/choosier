<script setup lang="ts">
const supabase = useSupabaseClient();
const profile = useProfile();

const data = reactive({
	uploading: false,
	src: '',
	files: null as FileList | null,
});

const fileInput = ref(null);

async function uploadAvatar(fileInput: HTMLInputElement) {
	data.files = fileInput.files;

	try {
		data.uploading = true;

		if (!data.files?.length) {
			throw new Error('You must select an image to upload.');
		}

		const file = data.files[0];
		file.name.split('.').pop();
		const fileName = profile.userId.value + '/avatar.JPG';

		let { error: uploadError } = await supabase.storage
			.from('avatars')
			.upload(fileName, file);

		if (uploadError) throw uploadError;
		getAvatar();
	} catch (error: any) {
		alert(error.message);
	} finally {
		data.uploading = false;
	}
}

function getAvatar() {
	const avatar = supabase.storage
		.from('avatars')
		.getPublicUrl(profile.userId.value + '/avatar.JPG', {
			transform: {
				width: 120,
				height: 120,
			},
		});

	data.src = avatar.data.publicUrl;
}

getAvatar();
</script>

<template>
	<div>
		<img
			v-if="data.src"
			:src="data.src"
			alt="Avatar"
			class="avatar image"
			style="width: 10em; height: 10em"
		/>
		<div v-else class="avatar no-image" :style="{ height: 160, width: 160 }" />

		<div style="width: 10em; position: relative">
			<label class="button primary block" for="single">
				{{ data.uploading ? 'Uploading ...' : 'Upload' }}
			</label>
			<input
				style="position: absolute; visibility: hidden"
				type="file"
				id="single"
				accept="image/*"
				ref="fileUpload"
				@change="uploadAvatar($event.target as HTMLInputElement)"
				:disabled="data.uploading"
			/>
		</div>
	</div>
</template>
