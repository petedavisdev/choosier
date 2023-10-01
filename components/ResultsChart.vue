<script setup lang="ts">
import { Votes } from './Results.vue';

const props = defineProps<{
	images: string[];
	votes: Votes;
}>();

const { profile } = useProfile();

const results = computed(() => {
	return props.images
		.map((image: string) => {
			return {
				image,
				voters: props.votes
					.filter((vote) => image === vote.image_url)
					.map((vote) => vote.profiles.username)
					.filter((vote) => vote)
					.sort(function (a, b) {
						return a === profile.value?.username
							? -1
							: b === profile.value?.username
							? 1
							: 0;
					}),
			};
		})
		.sort((a, b) => b.voters.length - a.voters.length);
});

const mostVotes = computed(() => results.value[0].voters.length);
</script>

<template>
	<article
		v-for="(result, index) in results"
		:key="index"
		:class="$style.result"
	>
		<img
			:src="result.image"
			alt=""
			:title="result.image.split('/').pop()?.replace('.webp', '')"
			:class="$style.image"
		/>
		<div
			:class="$style.bar"
			:style="{
				width: (100 * result.voters.length) / mostVotes + '%',
			}"
		>
			<strong :class="$style.count">{{ result.voters.length }}</strong>
			<span v-if="props.votes.length"
				>({{
					Math.round((100 * result.voters.length) / props.votes.length)
				}}%)</span
			>
			<div :class="$style.voters">
				<small
					v-for="voter in result.voters"
					:key="voter"
					:class="$style.voter"
				>
					<LinkTo :to="PATHS.user + voter" :class="$style.avatar">
						<Avatar :username="voter" />
					</LinkTo>
					{{ ' ' }}
				</small>
			</div>
		</div>
	</article>
</template>

<style module>
.result {
	display: grid;
	grid-template-columns: max-content 1fr;
	margin-top: 0.5em;
}

.bar {
	text-align: left;
	background-color: var(--light);
	border-top-right-radius: var(--radius);
	border-bottom-right-radius: var(--radius);
}

.count {
	font-size: 2em;
	padding: 0.25em;
}

.voters {
	padding: 0.2em 0.5em;
}

.voter {
	display: inline;
}

.avatar {
	font-size: 2em;
	height: 1em;
	width: 1em;
	display: inline-block;
	border-radius: 50%;
	overflow: hidden;
	text-decoration: none;
	box-sizing: content-box;
	margin: 0 0.125em 0.125em 0;
}

.image {
	width: 100%;
	max-width: min(20vw, 15vh);
	height: auto;
}
</style>
