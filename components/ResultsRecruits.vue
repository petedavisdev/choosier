<script setup lang="ts">
import type { Vote } from '../composables/useChoice';

const props = defineProps<{
	id: number;
	votes: Vote[];
	recruiterName: string;
	isRecruiter: boolean;
}>();

const supabase = useSupabaseClient<Database>();
const { profile } = useProfile();

const firstTimeVoters = computed(() => {
	return props.votes
		.filter(
			(vote) =>
				vote.profiles?.first_vote === props.id &&
				vote.profiles.username &&
				vote.profiles.username !== props.recruiterName
		)
		.map(
			(vote) =>
				({
					username: vote.profiles?.username,
					userId: vote.user_id,
				}) as { username: string; userId: string }
		);
});

const newRecruits = computed(() => {
	const recruitIds = firstTimeVoters.value.map((voter) => voter.userId);
	return recruitIds.filter((id) => !profile.value?.recruits.includes(id));
});

if (profile.value && props.isRecruiter && newRecruits.value.length) {
	const recruits = [...profile.value.recruits, ...newRecruits.value];

	try {
		await supabase
			.from('profiles')
			.update({ recruits })
			.eq('user_id', profile.value?.userId);

		profile.value.credits += newRecruits.value.length;
		profile.value.recruits = recruits;
	} catch (error) {
		alert(error);
	}
}
</script>

<template>
	<aside v-if="firstTimeVoters.length" class="box">
		<h2>Welcome to {{ firstTimeVoters.length }} first-time choosers!</h2>
		<p>
			<small
				v-for="{ username } in firstTimeVoters"
				:key="username"
				:class="$style.voter"
			>
				<LinkTo :to="PATHS.user + username" :class="$style.avatar">
					<UserAvatar :username="username" />
				</LinkTo>
			</small>
		</p>
		<strong>
			+{{ firstTimeVoters.length }} credits for
			<LinkTo :to="PATHS.user + props.recruiterName">
				{{ props.recruiterName }}
			</LinkTo>
		</strong>
	</aside>
</template>

<style module>
.voter {
	display: inline;
}

.avatar {
	font-size: 2em;
	height: 1em;
	width: 1em;
	display: inline-block;
	border-radius: 50%;
	border: 1px solid var(--lighter);
	overflow: hidden;
	text-decoration: none;
	box-sizing: content-box;
	margin: 0 0.125em 0.125em 0;
}
</style>
