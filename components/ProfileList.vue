<script setup lang="ts">
const supabase = useSupabaseClient();

const profilesResponse = await supabase
	.from('profiles')
	.select('username')
	.order('username', { ascending: true })
	.not('updated_at', 'is', null);

const profiles = profilesResponse.data as { username: string }[] | null;
</script>

<template>
	<p>You are among the first {{ profiles?.length }} choosers 🙌</p>
	<ul>
		<li v-for="(profile, index) in profiles" :key="index">
			<LinkTo :to="PATHS.user + profile.username">
				{{ profile.username }}
			</LinkTo>
		</li>
	</ul>
</template>
