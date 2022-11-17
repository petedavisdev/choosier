<template>
	<h1>
		@{{ route.params.username as string }}
		<RouterLink v-if="user?.id === response.data?.id" to="/account"
			>⚙️
		</RouterLink>
	</h1>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

const response = await supabase
	.from('profiles')
	.select(`id`)
	.eq('username', route.params.username)
	.single();
</script>
