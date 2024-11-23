<script setup lang="ts">
const { profile } = useProfile();
const supabase = useSupabaseClient<Database>();

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
				updated_at: new Date().toISOString(),
				subscriptions: data.subscriptions,
			};

			const response = await supabase
				.from('profiles')
				.update(updates)
				.eq('user_id', profile.value.userId);

			if (response.error) throw response.error;

			profile.value.subscriptions = updates.subscriptions;
		} catch (error: unknown) {
			alert((error as Error)?.message);
		} finally {
			data.loading = false;
		}
	}
}
</script>

<template>
	<p>
		<label>
			<input v-model="data.subscriptions" type="checkbox" value="weekly" />
			Weekly choosletter
		</label>

		{{ data.loading ? 'Saving...' : '' }}
	</p>
</template>
