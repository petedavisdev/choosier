<script setup lang="ts">
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';
import type { Choice } from '~/composables/useChoice';

const props = defineProps<{
	choice: Choice;
}>();

const {
	public: { polarUrl, polarCheckoutPath },
} = useRuntimeConfig();
const user = useSupabaseUser();
const polarCheckoutUrl = computed(() => {
	return `${polarUrl}${polarCheckoutPath}?customerEmail=${user.value?.email}&reference_id=${props.choice.id}`;
});

const isClosingSoon = computed(() => {
	if (!props.choice.closeAt) return false;
	const closeDate = new Date(props.choice.closeAt);
	const now = new Date();
	const hoursUntilClose =
		(closeDate.getTime() - now.getTime()) / (1000 * 60 * 60);
	return hoursUntilClose <= 24 && hoursUntilClose > 0;
});

onMounted(() => {
	PolarEmbedCheckout.init();
});
</script>

<template>
	<section class="box">
		<h2 v-if="props.choice.isExtended">Voting extended!</h2>

		<template v-if="!props.choice.isClosed">
			<Countdown v-if="isClosingSoon" :target-date="props.choice.closeAt!" />
			<h4 v-else>Voting closes {{ longDateText(props.choice.closeAt) }}</h4>
		</template>

		<p>Results will be available for a week after the poll closes</p>

		<template v-if="!props.choice.isExtended && !props.choice.isClosed">
			<h2>Need more time?</h2>
			<p>You can keep voting open for a week</p>
			<a
				:href="polarCheckoutUrl"
				type="button"
				class="button"
				data-polar-checkout
			>
				+7 days = $3.<small :class="$style.cents">50</small>
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
				+7 days = $3.<small :class="$style.cents">50</small>
			</a>
		</template>
	</section>
</template>

<style module>
.cents {
	font-weight: bold;
}
</style>
