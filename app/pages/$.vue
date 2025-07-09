<script setup lang="ts">
import { TIMES } from '~~/shared/utils/constants';
const { profile } = useProfile();
</script>

<template>
	<h1>Success!</h1>
	<p>Voting on your poll has been extended to {{ TIMES.extendDays }} days.</p>

	<p>
		<LinkTo :to="PATHS.user + profile?.username" class="button">
			My polls &rarr;
		</LinkTo>
	</p>
</template>
