<script setup lang="ts">
definePageMeta({
	layout: false,
});

const route = useRoute();
const id = +route.params.id;
const uuid = route.query.uuid as string | undefined;

const supabase = useSupabaseClient<Database>();

try {
	if (uuid) {
		const uuidResponse = await supabase
			.from('choices')
			.select('visibility')
			.eq('uuid', uuid)
			.eq('id', id)
			.single();

		if (!uuidResponse.data) throw new Error('Invalid uuid');
	} else {
		const idResponse = await supabase
			.from('choices')
			.select('visibility')
			.eq('id', id)
			.single();

		if (idResponse.data?.visibility === 'private')
			throw new Error('UUID required');
	}
} catch {
	navigateTo(PATHS.home);
}
</script>

<template>
	<Choose :id="id" />
</template>
