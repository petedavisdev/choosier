<template>
	<h1>
		@{{ route.params.username as string }}
		<RouterLink v-if="user?.id === response.data?.id" to="/account">
			<IconSettings class="icon" />
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

<style scoped>
a {
	text-decoration: none;
}

.icon {
	width: 0.8em;
	height: 0.8em;
}
</style>
