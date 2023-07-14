<script setup lang="ts">
const props = defineProps<{
	isUser: boolean;
	username: string;
	website: string;
	avatar: string;
}>();
</script>

<template>
	<header :class="$style.header">
		<h1 :class="$style.username">@{{ props.username }}</h1>

		<LinkTo v-if="props.website" :to="props.website" target="_blank">
			{{ props.website.replace(/^https?:\/\//, '') }}
			↗
		</LinkTo>

		<img
			v-if="props.avatar"
			:src="props.avatar"
			:class="$style.avatar"
			height="110"
			width="110"
		/>

		<div v-else-if="isUser" :class="avatar"></div>
	</header>
</template>

<style module>
.header {
	display: grid;
	grid-template:
		'avatar _' 1fr
		'avatar username' 2fr
		'avatar website' 1fr / auto 1fr;
	gap: 0.5em 0;
	margin-block: 2em;
}

.name {
	grid-area: name;
	margin: 0;
}

.website {
	grid-area: website;
}

.avatar {
	grid-area: avatar;
	height: 110px;
	width: 110px;
	border-radius: 50%;
	background-color: var(--light);
	margin-right: 1em;
}
</style>
