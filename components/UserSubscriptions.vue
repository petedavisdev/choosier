<script setup lang="ts">
const { profile } = useProfile();
const supabase = useSupabaseClient();

const data = reactive({
	subscriptions: profile.value?.subscriptions,
	loading: false,
});

watch(
	() => data.subscriptions,
	() => updateProfile()
);

async function updateProfile() {
	if (profile.value) {
		try {
			data.loading = true;

			const updates = {
				user_id: profile.value?.userId,
				subscriptions: data.subscriptions,
				updated_at: new Date(),
			};

			// @ts-ignore: Unreachable code error
			const response = await supabase.from('profiles').upsert(updates, {
				returning: 'minimal',
			});

			if (response.error) throw response.error;

			profile.value.subscriptions = updates.subscriptions;
		} catch (error: any) {
			alert(error.message);
		} finally {
			data.loading = false;
		}
	}
}
</script>

<template>
	<p>
		<label>
			<input v-model="data.subscriptions" type="checkbox" value="monthly" />
			Monthly choosletter
		</label>

		{{ data.loading ? 'Saving...' : '' }}
	</p>
</template>
