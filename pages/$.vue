<script setup lang="ts">
const { profile } = useProfile();

const data = reactive({
	quantity: false,
});

function buyCredits(quantity: number) {
	data.quantity = !!quantity;
}

function price(quantity: number, discount: number) {
	return Math.round(quantity * CREDIT_VALUE * (1 - discount));
}
</script>

<template>
	<h1>
		You have {{ profile?.credits }} credit{{
			profile?.credits === 1 ? '' : 's'
		}}
	</h1>

	<section class="grid">
		<article
			v-for="(pack, index) in CREDIT_PACKS"
			:key="index"
			class="box center"
			:class="$style.pack"
		>
			<h2 :class="$style.title">
				{{ pack.quantity }} credits
				<br />
				<small>
					<s v-if="pack.discount" :class="$style.strike"
						>&nbsp;${{ pack.quantity * CREDIT_VALUE }}&nbsp;</s
					>
				</small>
				${{ price(pack.quantity, pack.discount) }}
			</h2>

			<p>${{ (CREDIT_VALUE * (1 - pack.discount)).toFixed(2) }} per credit</p>

			<h2>
				&nbsp;
				{{ pack.discount ? `Save ${Math.round(pack.discount * 100)}%` : ' ' }}
				&nbsp;
			</h2>

			<button class="button" @click="buyCredits(pack.quantity)">
				Buy {{ pack.quantity }} credits
			</button>
		</article>
	</section>

	<aside v-if="data.quantity" class="backdrop">
		<div class="box center">
			<button class="close" @click="data.quantity = false"></button>
			<h2>Sorry, the payment system isn't ready yet!</h2>
			<p>
				If you need credits, please let me know and I'll get back to you as soon
				as I can.
			</p>
			<LinkTo :to="PATHS.contact" class="button">Contact Pete 👋</LinkTo>
		</div>
	</aside>
</template>

<style module>
.title {
	font-size: xx-large;
}

.pack {
	background-color: var(--pink);
}

.pack:first-child {
	background-color: var(--blue);
}

.pack:last-child {
	background-color: var(--green);
}

.strike {
	color: var(--mid);
	text-decoration-color: var(--dark);
	text-decoration-thickness: 2px;
	text-decoration-style: double;
}
</style>
