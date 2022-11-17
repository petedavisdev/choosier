<template>
	<div class="progress-bar">
		<div
			class="progress-indicator"
			:style="{ width: String($attrs.percent) + '%' }"
		></div>
	</div>
</template>

<style scoped>
.progress-bar,
.progress-indicator {
	height: 0.375em;
	background-color: var(--mid);
}

.progress-indicator {
	height: 100%;
	background-color: var(--dark);
}
</style>
