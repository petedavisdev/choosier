<script setup lang="ts">
const route = useRoute();
const id = +route.params.id;
const choice = await useChoice(id);

const { profile } = useProfile();
</script>

<template>
	<template v-if="choice.username === profile?.username && !choice.isRemoved">
		<List :filter="['id', id]">Choice not found</List>

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
	<p v-else>Not available</p>
</template>

<style module>
.section {
	margin-bottom: 3em;
	display: grid;
	gap: 1em;
}
</style>
