<script setup lang="ts">
import type { Choice } from '~/composables/useChoice';

const props = defineProps<{
	choice: Choice;
	isPrivate: boolean;
}>();

const title = ref(props.choice.title);
const category = ref(props.choice.category);

async function updateChoice() {
	const supabase = useSupabaseClient<Database>();

	try {
		const response = await supabase
			.from('choices')
			.update({ title: title.value, category: category.value })
			.eq('id', props.choice.id);

		if (response.error) throw response.error;

		navigateTo(PATHS.user + props.choice.username);
	} catch (error: unknown) {
		alert((error as Error)?.message);
	}
}
</script>

<template>
	<form :class="$style.form" @submit.prevent="updateChoice">
		<section id="title">
			<h3><label for="title">Title</label></h3>

			<p :class="$style.help">Help {{ choice.username }} choose:</p>
			<input
				id="title"
				v-model="title"
				:class="$style.titleInput"
				maxlength="25"
				required
			/>
			<small>{{
				title.length > 15
					? `${25 - title.length} characters remaining`
					: '&nbsp;'
			}}</small>
		</section>

		<section v-if="!props.isPrivate" id="categories">
			<h3>Category</h3>
			<p v-for="(categoryName, key) in CATEGORIES" :key="key">
				<label>
					<input
						v-model="category"
						type="radio"
						name="category"
						:value="key"
						required
					/>
					{{ categoryName }}
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

.help {
	margin: -1em 0 0.25em;
}
</style>
