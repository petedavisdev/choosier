<script setup lang="ts">
const user = useSupabaseUser();
const { profile } = useProfile();

const data = reactive({
	quantity: false,
});
</script>

<template>
	<Script async src="https://js.stripe.com/v3/buy-button.js"> </Script>

	<div v-if="profile">
		<h1>Credits top-ups</h1>

		<p>
			<strong>
				You have {{ profile?.credits }} credit{{
					profile?.credits === 1 ? '' : 's'
				}}.
			</strong>
			<span v-for="type in VISIBILITIES" :key="type.name">
				{{ type.name }} polls use {{ type.credits }} credit{{
					type.credits === 1 ? '' : 's'
				}}.
			</span>
		</p>

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
						<s
							v-if="pack.price < pack.quantity * CREDIT_VALUE"
							:class="$style.strike"
							>&nbsp;${{ pack.quantity * CREDIT_VALUE }}&nbsp;</s
						>
					</small>
					${{ pack.price }}
				</h2>

				<p>${{ (pack.price / pack.quantity).toFixed(2) }} per credit</p>

				<h2>
					&nbsp;
					{{
						pack.price < pack.quantity * CREDIT_VALUE
							? `Save ${Math.round((1 - pack.price / pack.quantity) * 100)}%`
							: ' '
					}}
					&nbsp;
				</h2>

				<button class="button">Buy {{ pack.quantity }} credits</button>

				<stripe-buy-button
					v-if="pack.quantity === 10"
					buy-button-id="buy_btn_1Q7fmCP0tza5oUsas3nobhjO"
					publishable-key="pk_test_51Q7bkeP0tza5oUsa47y41xxdu7hf5XnheXJW3RxecIdZ6c9j9texFVaec0L4aCtzeI8vdoRqUYWN25ozowSuAIoq00MOJjlYoE"
					:client-reference-id="user?.id"
					:customer-email="user?.email"
				></stripe-buy-button>
			</article>
		</section>

		<aside v-if="data.quantity" class="backdrop">
			<div class="box center">
				<button class="close" @click="data.quantity = false"></button>
				<h2>Sorry, the payment system isn't ready yet!</h2>
				<p>
					If you need credits, please let me know and I'll get back to you as
					soon as I can.
				</p>
				<LinkTo :to="PATHS.contact" class="button">Contact Pete 👋</LinkTo>
			</div>
		</aside>
	</div>

	<UserLogin v-else>
		<h1>Login to top up your credits</h1>
	</UserLogin>
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
