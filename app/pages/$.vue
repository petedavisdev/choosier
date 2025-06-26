<script setup lang="ts">
import { TIMES } from '~~/shared/utils/constants';
</script>

<template>
	<h1>Success!</h1>
	<p>Voting on your poll has been extended to {{ TIMES.extendDays }} days.</p>

	<LinkTo :to="PATHS.user + $route.params.username" class="button">
		My polls &rarr;
	</LinkTo>
</template>
