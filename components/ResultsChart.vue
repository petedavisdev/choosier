<script setup lang="ts">
import type { Choice, Vote } from '../composables/useChoice';

const props = defineProps<{
	images: string[];
	votes: Vote[];
	votingSystem: Choice['votingSystem'];
}>();

const { profile } = useProfile();

const SECOND_DIVIDER = 1.9999;

const results = computed(() => {
	return props.images
		.map((image: string) => {
			const firsts = props.votes
				.filter(
					(vote) => image === vote.image_urls?.[0] && vote.profiles?.username
				)
				.map((vote) => vote.profiles?.username);

			const seconds = props.votes
				.filter(
					(vote) => image === vote.image_urls?.[1] && vote.profiles?.username
				)
				.map((vote) => vote.profiles?.username);

			const points = firsts.length + seconds.length / SECOND_DIVIDER;

			const maxPoints = Math.max(firsts.length, seconds.length);

			return { image, firsts, seconds, points, maxPoints } as {
				image: string;
				firsts: string[];
				seconds: string[];
				points: number;
				maxPoints: number;
			};
		})
		.sort((a, b) => b.points - a.points);
});

const mostVotes = computed(() =>
	results.value.reduce((max, result) => Math.max(max, result.maxPoints), 0)
);
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

		<div :class="$style.bars">
			<section
				v-if="result.firsts.length"
				:class="$style.firsts"
				:style="{
					width: (100 * result.firsts.length) / mostVotes + '%',
				}"
			>
				<strong :class="$style.count">{{ result.firsts.length }}</strong>
				<sup v-if="votingSystem === '2'" :class="$style.preference">#1</sup>
				<span v-for="voter in result.firsts" :key="voter" :class="$style.voter">
					<LinkTo
						:to="PATHS.user + voter"
						:class="`${$style.avatar} ${profile?.username === voter ? $style.myAvatar : ''}`"
					>
						<UserAvatar :username="voter" />
					</LinkTo>
				</span>
			</section>
			<section v-else>&nbsp;</section>

			<section
				v-if="votingSystem === '2' && result.seconds.length"
				:class="$style.seconds"
				:style="{
					width: (100 * result.seconds.length) / mostVotes + '%',
				}"
			>
				<span :class="$style.count">{{ result.seconds.length }}</span>
				<sup :class="$style.preference">#2</sup>
				<span
					v-for="voter in result.seconds"
					:key="voter"
					:class="$style.voter"
				>
					<LinkTo
						:to="PATHS.user + voter"
						:class="`${$style.avatar} ${profile?.username === voter ? $style.myAvatar : ''}`"
					>
						<UserAvatar :username="voter" />
					</LinkTo>
				</span>
			</section>
			<section v-else>&nbsp;</section>
		</div>
	</article>

	<p><small>Ranking: 1 first choice is worth 2 second choices</small></p>
</template>

<style module>
.result {
	display: grid;
	margin-top: 1em;
}

@media (min-width: 600px) {
	.result {
		grid-template-columns: max-content 1fr;
	}
}

.bars {
	height: 100%;
	display: grid;
	grid-template-rows: 2fr 1fr;
	gap: 1px;
}

.result:nth-of-type(1) .firsts,
.result:nth-of-type(1) {
	--background-color: var(--green);
}
.result:nth-of-type(2) .firsts,
.result:nth-of-type(2) {
	--background-color: var(--yellow);
}
.result:nth-of-type(3) .firsts,
.result:nth-of-type(3) {
	--background-color: var(--peach);
}
.result:nth-of-type(4) .firsts,
.result:nth-of-type(4) {
	--background-color: var(--pink);
}
.result:nth-of-type(5) .firsts,
.result:nth-of-type(5) {
	--background-color: var(--purple);
}
.result:nth-of-type(6) .firsts,
.result:nth-of-type(6) {
	--background-color: var(--blue);
}

.firsts,
.seconds {
	text-align: left;
	background: linear-gradient(
		to right,
		#2220 0%,
		var(--background-color, #ccc) 20dvw
	);
	padding: 0.5em;
	border-top-right-radius: var(--radius);
	border-bottom-right-radius: var(--radius);
}

.count {
	float: right;
	font-size: 1.5em;
	margin-top: -0.25em;
	margin-left: 0.25em;
}

.preference {
	font-size: 1em;
	margin-right: 0.25em;
}

.avatar {
	font-size: 1.33em;
	height: 1em;
	width: 1em;
	display: inline-block;
	border-radius: 50%;
	border: 2px solid transparent;
	overflow: hidden;
	text-decoration: none;
	box-sizing: content-box;
}

.voter {
	display: inline-block;
	padding: 0;
}

.myAvatar {
	border-color: var(--dark);
}

.image {
	max-width: min(20svw, 20svh);
	height: auto;
	object-fit: contain;
}
</style>
