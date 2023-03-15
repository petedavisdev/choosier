<script setup lang="ts">
import { Vote } from '~/types/Vote';

const props = defineProps<{
	id: number;
	votes: Vote[];
	recruiterName: string;
	isRecruiter: boolean;
}>();

const supabase = useSupabaseClient();
const profile = useProfile();

const firstTimeVoters = computed(() => {
	return props.votes
		.filter((vote) => vote.profiles.first_vote === props.id)
		.map((vote) => ({
			username: vote.profiles.username,
			userId: vote.user_id,
		}))
		.filter((vote) => vote.username !== props.recruiterName);
});

const newRecruits = computed(() => {
	const recruitIds = firstTimeVoters.value.map((voter) => voter.userId);
	return recruitIds.filter((id) => !profile.recruits.value.includes(id));
});

if (props.isRecruiter && newRecruits.value.length) {
	const recruits = [...profile.recruits.value, ...newRecruits.value];

	try {
		await supabase
			.from('profiles')
			// @ts-ignore
			.update({ recruits })
			.eq('user_id', profile.userId.value);

		profile.credits.value += newRecruits.value.length;
		profile.recruits.value = recruits;
	} catch (error) {
		alert(error);
	}
}
</script>

<template>
	<aside v-if="firstTimeVoters.length" class="box" :class="$style.welcome">
		<h2>Welcome to {{ firstTimeVoters.length }} first-time choosers!</h2>
		<p>
			<template v-for="{ username } in firstTimeVoters" :key="username">
				<LinkTo :to="'/@' + username"> @{{ username }}</LinkTo
				>{{ ' ' }}
			</template>
		</p>
		<strong>
			+{{ firstTimeVoters.length }} credits for
			<LinkTo :to="'/@' + props.recruiterName">
				@{{ props.recruiterName }}
			</LinkTo>
		</strong>
	</aside>
</template>

<style module>
@media (min-width: 1000px) {
	.welcome {
		grid-column: span 2;
	}
}
</style>
