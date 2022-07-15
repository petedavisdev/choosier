<template>
    <div class="progress-bar">
        <div class="progress-indicator" :style="{width: $attrs.percent + '%'}"></div>
    </div>
</template>

<style scoped>
.progress-bar {
    height: 2px;
    background-color: silver;
    width: 40px;
    display: inline-block;
    width: calc(100vmin - 4em);
}

.progress-indicator {
    height: 100%;
    background-color: var(--darker);
}
</style>