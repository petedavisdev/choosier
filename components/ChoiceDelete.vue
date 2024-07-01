<script setup lang="ts">
const props = defineProps<{
	id: number;
	username: string;
	isClosed?: boolean;
}>();

const supabase = useSupabaseClient<Database>();

const now = new Date().toISOString();

async function closeChoice() {
	updateChoice({ close_at: now });
}

async function deleteChoice() {
	updateChoice({ close_at: now, remove_at: now });
}

async function updateChoice(update: Record<string, string>) {
	try {
		const response = await supabase
			.from('choices')
			.update(update)
			.eq('id', props.id);

		if (response.error) throw response.error;

		navigateTo(PATHS.user + props.username);
	} catch (error: unknown) {
		if (error instanceof Error) alert(error.message!);
	}
}
</script>

<template>
	<form v-if="!props.isClosed" @submit.prevent="closeChoice">
		<section>
			<h3>Close voting for this choice</h3>
			<p>You will still have access to the results.</p>
			<p>
				<button class="button" type="submit">Close voting now!</button>
			</p>
		</section>
	</form>

	<h3 v-else>Voting has closed</h3>

	<form @submit.prevent="deleteChoice">
		<section>
			<h3>Delete this choice</h3>
			<p>You will lose access to the choice and the results.</p>
			<p>
				<button class="button" type="submit">Delete it now!</button>
			</p>
		</section>
	</form>
</template>
