<template>
	<div :class="$style.bar">
		<div
			:class="$style.indicator"
			:style="{ maxWidth: String($attrs.percent) + '%' }"
		></div>
	</div>
</template>

<style module>
.bar,
.indicator {
	height: 0.375em;
	border-radius: 0.25em;
	background-color: var(--light);
}

.indicator {
	height: 100%;
	background-color: var(--dark);
	transition: max-width 0.5s ease-out;
}
</style>
