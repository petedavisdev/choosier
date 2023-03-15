<script setup lang="ts">
const props = defineProps<{
	id: number;
	username: string;
}>();

const date = new Date().toISOString();

async function closeChoice() {
	updateChoice({ close_at: date });
}

async function deleteChoice() {
	updateChoice({ remove_at: date });
}

async function updateChoice(update: Record<string, string>) {
	const supabase = useSupabaseClient();
	const router = useRouter();

	try {
		const response = await supabase
			.from('choices')
			// @ts-ignore unreachable code
			.update(update)
			.eq('id', props.id);

		if (response.error) throw response.error;

		router.push('@' + props.username);
	} catch (error: any) {
		alert(error.message);
	}
}
</script>

<template>
	<form @submit.prevent="closeChoice">
		<section>
			<h3>Close voting for this choice</h3>
			<p>You will still have access to the results.</p>
			<p>
				<button class="button" type="submit">Close voting now!</button>
			</p>
		</section>
	</form>

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
