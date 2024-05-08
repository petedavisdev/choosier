<script setup lang="ts">
import type { Vote } from '../composables/useChoice';

const props = defineProps<{
	images: string[];
	votes: Vote[];
}>();

const { profile } = useProfile();

const results = computed(() => {
	return props.images
		.map((image: string) => {
			return {
				image,
				voters: props.votes
					.filter(
						(vote) => image === vote.image_urls?.[0] && vote.profiles?.username
					)
					.map((vote) => vote.profiles?.username),
			} as { image: string; voters: string[] };
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
					<LinkTo
						:to="PATHS.user + voter"
						:class="`${$style.avatar} ${profile?.username === voter ? $style.myAvatar : ''}`"
					>
						<UserAvatar :username="voter" />
					</LinkTo>
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
	background: linear-gradient(
		to right,
		#2220 0%,
		var(--background-color, #ccc) 20dvw
	);
	border-top-right-radius: var(--radius);
	border-bottom-right-radius: var(--radius);
}

.result:nth-of-type(1) .bar {
	--background-color: var(--green);
}
.result:nth-of-type(2) .bar {
	--background-color: var(--yellow);
}
.result:nth-of-type(3) .bar {
	--background-color: var(--peach);
}
.result:nth-of-type(4) .bar {
	--background-color: var(--pink);
}
.result:nth-of-type(5) .bar {
	--background-color: var(--purple);
}
.result:nth-of-type(6) .bar {
	--background-color: var(--blue);
}

.count {
	font-size: 2em;
	padding: 0.25em;
}

.voters {
	padding: 0.125em 0.5em 0.125em;
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
	border: 1px solid var(--lighter);
	overflow: hidden;
	text-decoration: none;
	box-sizing: content-box;
	margin: 0 0.125em 0.125em 0;
}

.myAvatar {
	border-color: var(--dark);
}

.image {
	width: 100%;
	max-width: min(20vw, 15vh);
	height: auto;
}
</style>
