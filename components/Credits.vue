<template>
	<CreditsGet
		v-if="data.showCredits"
		:close="closeCredits"
		:credits="profile.credits.value"
	/>
	<p>
		You have <strong>{{ profile.credits }}</strong> credit{{
			profile.credits.value === 1 ? '' : 's'
		}}.
		<a href="#credits" @click.prevent="data.showCredits = true">Get credits</a>
	</p>
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
