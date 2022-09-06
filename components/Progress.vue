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
	height: 3px;
	background-color: silver;
	border-radius: 1.5px;
}

.progress-indicator {
	height: 100%;
	background-color: var(--darker);
}
</style>
