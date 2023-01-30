<template>
	<p>
		<label>
			<input type="checkbox" value="monthly" v-model="data.subscriptions" />
			Monthly choosletter
		</label>

		{{ data.loading ? 'Saving...' : '' }}
	</p>
</template>

<script setup lang="ts">
const profile = useProfile();
const supabase = useSupabaseClient();

const data = reactive({
	subscriptions: profile.subscriptions.value,
	loading: false,
});

watch(
	() => data.subscriptions,
	(subscriptions) => {
		updateProfile();
	}
);

async function updateProfile() {
	try {
		data.loading = true;

		const updates = {
			user_id: profile.userId.value,
			subscriptions: data.subscriptions,
			updated_at: new Date(),
		};

		// @ts-ignore: Unreachable code error
		const response = await supabase.from('profiles').upsert(updates, {
			returning: 'minimal',
		});

		if (response.error) throw response.error;

		profile.subscriptions.value = updates.subscriptions;
	} catch (error: any) {
		alert(error.message);
	} finally {
		data.loading = false;
	}
}
</script>
