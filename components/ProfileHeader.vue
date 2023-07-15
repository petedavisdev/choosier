<script setup lang="ts">
const props = defineProps<{
	username: string;
	website?: string;
	avatar?: string;
}>();

const { profile } = useProfile();
const isUser = props.username === profile.value?.username;
</script>

<template>
	<header :class="$style.header">
		<div :class="$style.avatar">
			<Avatar :username="props.username" :avatar="props.avatar" />
		</div>

		<h1 :class="$style.username">
			{{ props.username }}

			<LinkTo v-if="isUser" :to="PATHS.user">
				<IconSettings :class="$style.icon" />
			</LinkTo>
		</h1>

		<LinkTo
			v-if="props.website"
			:to="props.website"
			:class="$style.website"
			target="_blank"
		>
			{{ props.website.replace(/^https?:\/\//, '') }}
			↗
		</LinkTo>
	</header>
</template>

<style module>
.header {
	margin-block: 2em;
}

.username {
	grid-area: username;
	margin: 0;
	align-self: end;
}

.website {
	grid-area: website;
}

.avatar {
	grid-area: avatar;
	font-size: 8em;
	height: 1em;
	width: 1em;
	background-color: var(--light);
	margin-right: 1rem;
	border-radius: 50%;
	overflow: hidden;
}

.icon {
	width: 0.8em;
	height: 0.8em;
	text-decoration: none;
}

@media (min-width: 600px) {
	.header {
		display: grid;
		gap: 0.5em 0;
		grid-template:
			'avatar username' 2fr
			'avatar website' 1fr / auto 1fr;
	}
}
</style>
