<script setup lang="ts">
const route = useRoute();
const id = +route.params.id;
const choice = await useChoice(id);

const { profile } = useProfile();

if (choice.isRemoved) {
	navigateTo(PATHS.home);
}

if (choice.username !== profile.value?.username) {
	navigateTo('/' + id);
}
</script>

<template>
	<Head
		><Meta
			v-if="choice.visibility === 'private'"
			name="robots"
			content="noindex"
		/>
	</Head>

	<h1>Voting is now {{ choice.isClosed ? 'closed' : 'open' }}</h1>
	<List :filter="['id', id]" allow-private />

	<div class="box" :class="$style.section">
		<h1>Share</h1>
		<p v-if="choice.visibility === 'private'">
			Here is your private link. Share it with people you trust.
		</p>
		<Share
			:id="id"
			:uuid="choice.visibility === 'private' ? choice.uuid : undefined"
		/>
	</div>

	<div class="box" :class="$style.section">
		<h1>Edit</h1>
		<ChoiceEdit :id="id" :choice="choice" />
	</div>

	<div class="box" :class="$style.section">
		<h1>Danger zone!</h1>
		<ChoiceDelete
			:id="id"
			:username="choice.username"
			:is-closed="choice.isClosed"
		/>
	</div>
</template>

<style module>
.section {
	margin-bottom: 3em;
	padding-top: 0;
	padding-bottom: 1rem;
}
</style>
