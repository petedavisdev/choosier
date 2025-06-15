<script setup lang="ts">
import type { Choice } from '~/composables/useChoice';

const props = defineProps<{
	choice: Choice;
}>();

const productId = useRuntimeConfig().public.polarProductId;
const user = useSupabaseUser();

async function checkout() {
	try {
		const response = await $fetch(
			`/api/checkout?products=${productId}&externalCustomerId=${user.value?.id}&customerEmail=${user.value?.email}&metadata={"choice_id":${props.choice.id}}`,
			{
				method: 'POST',
			}
		);
		console.log(response);
	} catch (error: unknown) {
		if (error instanceof Error) {
			alert(error.message);
		} else {
			alert('An unknown error occurred');
		}
	}
}

// const { profile } = useProfile();

// async function promoteChoice() {
// 	console.log('choice', props.choice);
// 	if (!profile.value) return;

// 	const supabase = useSupabaseClient<Database>();

// 	const close_at = addDaysToISODate(7, props.choice.createdAt);
// 	const remove_at = addDaysToISODate(7, close_at);

// 	try {
// 		const choiceResponse = await supabase
// 			.from('choices')
// 			.update({
// 				close_at,
// 				remove_at,
// 			})
// 			.eq('id', props.choice.id);

// 		if (choiceResponse.error) throw choiceResponse.error;

// 		navigateTo(PATHS.user + profile.value.username);
// 	} catch (error: unknown) {
// 		alert((error as Error)?.message);
// 	}
// }
</script>

<template>
	<section class="box">
		<h4 v-if="!props.choice.isClosed">
			Voting closes {{ longDateText(props.choice.closeAt) }}
		</h4>

		<p>
			Results will be available until {{ shortDateText(props.choice.removeAt) }}
		</p>

		<template v-if="!choice.isClosed">
			<h2>Need more time?</h2>
			<p>You can keep voting open for up to a week</p>
		</template>

		<template v-else>
			<h2>Need more votes?</h2>
		</template>

		<p>
			You will soon be able to pay online for more time, but for now, please
			send me a message quoting
			<strong>"Poll number {{ props.choice.id }}"</strong> and I will extend it
			for you.
		</p>

		<button type="button" class="button" @click="checkout">
			Request an extension
		</button>
	</section>
</template>
