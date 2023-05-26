<template>
	<div :class="$style.bar">
		<div
			:class="$style.indicator"
			:style="{ width: String($attrs.percent) + '%' }"
		></div>
	</div>
</template>

<style module>
.bar,
.indicator {
	height: 0.5em;
	border-radius: 0.25em;
	background-color: var(--light);
}

.indicator {
	height: 100%;
	background-color: var(--dark);
}
</style>
