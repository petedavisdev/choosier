<script setup lang="ts">
import type { Choice } from '~/composables/useChoice';

const props = defineProps<{
	choice: Choice;
	isPrivate: boolean;
}>();

const data = reactive({
	title: props.choice.title,
	category: props.choice.category,
});

async function updateChoice() {
	const supabase = useSupabaseClient<Database>();

	try {
		const response = await supabase
			.from('choices')
			.update({ title: data.title, category: data.category })
			.eq('id', props.choice.id);

		if (response.error) throw response.error;

		navigateTo(PATHS.user + props.choice.username);
	} catch (error: unknown) {
		if (error instanceof Error) alert(error.message!);
	}
}
</script>

<template>
	<form :class="$style.form" @submit.prevent="updateChoice">
		<section id="title">
			<h3><label for="title">Title</label></h3>
			<input
				id="title"
				v-model="data.title"
				:class="$style.titleInput"
				maxlength="25"
				required
			/>
			<small>{{
				data.title.length > 15
					? `${25 - data.title.length} characters remaining`
					: '&nbsp;'
			}}</small>
		</section>

		<section v-if="!props.isPrivate" id="categories">
			<h3>Category</h3>
			<p v-for="(category, key) in CATEGORIES" :key="key">
				<label>
					<input
						v-model="data.category"
						type="radio"
						name="category"
						:value="key"
						required
					/>
					{{ category }}
				</label>
			</p>
		</section>

		<p>
			<button class="button" type="submit">Save</button>
		</p>
	</form>
</template>

<style module>
.form {
	display: grid;
	gap: 1em;
}

.titleInput {
	width: 100%;
	max-width: 25em;
	display: block;
}
</style>
