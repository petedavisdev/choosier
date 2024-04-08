<script setup lang="ts">
const route = useRoute();
const id = +route.params.id;
const choice = await useChoice(id);

const { profile } = useProfile();
if (choice.username !== profile.value?.username || choice.isRemoved) {
	navigateTo(PATHS.home);
}
</script>

<template>
	<List :filter="['id', id]" allow-private>Choice not found</List>

	<div class="box" :class="$style.section">
		<h1>Edit choice</h1>
		<ChoiceEdit :id="id" :choice="choice" />
	</div>

	<div class="box" :class="$style.section">
		<h2>Danger zone!</h2>
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
	display: grid;
	gap: 1em;
}
</style>
