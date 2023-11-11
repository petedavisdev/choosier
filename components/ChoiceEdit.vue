<script setup lang="ts">
import type { Choice } from '~/composables/useChoice';

const props = defineProps<{
	id: number;
	choice: Choice;
}>();

const data = reactive({
	title: props.choice.title,
	category: props.choice.category,
});

async function updateChoice() {
	const supabase = useSupabaseClient();

	try {
		const response = await supabase
			.from('choices')
			// @ts-ignore unreachable code
			.update({ title: data.title, category: data.category })
			.eq('id', props.id);

		if (response.error) throw response.error;

		navigateTo(PATHS.user + props.choice.username);
	} catch (error: any) {
		alert(error.message);
	}
}
</script>

<template>
	<form @submit.prevent="updateChoice" :class="$style.form">
		<section id="title">
			<h2><label for="title">Title</label></h2>
			<input
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

		<section id="categories">
			<h2>Category</h2>
			<p v-for="(category, key) in CATEGORIES" :key="key">
				<label>
					<input
						type="radio"
						name="category"
						v-model="data.category"
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
