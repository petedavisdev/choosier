<template>
	<p>
		You have <strong>{{ profile.credits }}</strong> credit{{
			profile.credits.value === 1 ? '' : 's'
		}}.
	<p>Choices are free, but you can use credits for bonus features.</p>
		<a href="#credits" @click.prevent="data.showCredits = true">Get credits</a>
	</p>

	<NewChoiceCredits
		v-if="data.showCredits"
		:close="closeCredits"
		:credits="profile.credits.value"
	/>
</template>

<script setup lang="ts">
const profile = useProfile();

const data = reactive({
	showCredits: false,
});

function closeCredits() {
	data.showCredits = false;
}
</script>
