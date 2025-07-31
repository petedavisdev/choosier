<script setup lang="ts">
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';
import type { Choice } from '~/composables/useChoice';

const props = defineProps<{
	choice: Choice;
}>();

const {
	public: { polarCheckoutLink },
} = useRuntimeConfig();
const user = useSupabaseUser();
const polarCheckoutUrl = computed(() => {
	return `${polarCheckoutLink}?customerEmail=${user.value?.email}&reference_id=${props.choice.id}`;
});

onMounted(() => {
	PolarEmbedCheckout.init();
});
</script>

<template>
	<section class="box">
		<h2 v-if="props.choice.isExtended && !props.choice.isClosed">
			Voting extended!
		</h2>

		<h4 v-if="!props.choice.isClosed">
			<Countdown
				:date="props.choice.closeAt!"
				date-text="Voting closes"
				countdown-text="Voting closes in"
			/>
		</h4>

		<p>
			<Countdown
				:date="String(props.choice.removeAt)"
				date-text="Results available until"
				countdown-text="Results deleted in"
			/>
		</p>

		<template v-if="!props.choice.isExtended && !props.choice.isClosed">
			<h2>Need more time?</h2>

			<p>The first {{ TIMES.closeHours }} hours of voting are free!</p>

			<p>You can keep voting open for a week</p>
			<a
				:href="polarCheckoutUrl"
				type="button"
				class="button"
				data-polar-checkout
			>
				+{{ TIMES.extendDays }} days = $3.<small :class="$style.cents"
					>50</small
				>
			</a>
		</template>

		<template v-if="!props.choice.isExtended && props.choice.isClosed">
			<h2>Need more votes?</h2>
			<p>You can re-open voting for a week</p>
			<a
				:href="polarCheckoutUrl"
				type="button"
				class="button"
				data-polar-checkout
			>
				+{{ TIMES.extendDays }} days = $3.<small :class="$style.cents"
					>50
				</small>
			</a>
		</template>
	</section>
</template>

<style module>
.cents {
	font-weight: bold;
}
</style>
