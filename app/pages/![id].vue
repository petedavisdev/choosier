<script setup lang="ts">
const route = useRoute();
const id = +route.params.id!;
const choice = await useChoice(id);

const { profile } = useProfile();

if (choice.isRemoved) {
	navigateTo(PATHS.user + profile.value?.username);
}

if (profile.value && choice.username !== profile.value?.username) {
	navigateTo(PATHS.home + id);
}

const isPrivate = choice.visibility === 'private';
</script>

<template>
	<Head>
		<Meta name="robots" content="noindex" />
	</Head>

	<template v-if="profile?.username === choice.username">
		<List :filter="['id', id]" allow-private />

		<h1>Voting is now {{ choice.isClosed ? 'closed' : 'open' }}</h1>

		<div class="grid">
			<section v-if="!choice.isClosed" class="box" :class="$style.wideSection">
				<h2>Share</h2>
				<Share :id="id" :uuid="isPrivate ? choice.uuid : undefined" />
			</section>

			<ChoiceExtend :choice="choice" />
		</div>

		<div class="grid">
			<section class="box" :class="$style.wideSection">
				<h2>Edit</h2>
				<ChoiceEdit :choice="choice" :is-private="isPrivate" />
			</section>

			<section class="box">
				<h2>Danger zone!</h2>
				<ChoiceDelete
					:id="id"
					:username="choice.username"
					:is-closed="choice.isClosed"
				/>
			</section>
		</div>
	</template>

	<template v-else>
		<h1>Login</h1>
		<UserLogin />
	</template>
</template>

<style module>
@media (min-width: 1000px) {
	.wideSection {
		grid-column: span 2;
	}
}
</style>
