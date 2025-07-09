<script setup lang="ts">
const props = defineProps<{
	date: string;
	dateText: string;
	countdownText: string;
}>();

const timeLeft = ref('');
let interval: number | null = null;

const isSoon = computed(() => {
	if (!props.date) return false;
	const closeDate = new Date(props.date);
	const now = new Date();
	const hoursUntilClose =
		(closeDate.getTime() - now.getTime()) / (1000 * 60 * 60);
	return hoursUntilClose <= 24 && hoursUntilClose > 0;
});

function updateTimeLeft() {
	const now = new Date();
	const target = new Date(props.date);
	const diff = target.getTime() - now.getTime();

	if (diff <= 0) {
		timeLeft.value = 'Voting has ended';
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
		return;
	}

	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);

	timeLeft.value = `${to2Digits(hours)}:${to2Digits(minutes)}:${to2Digits(seconds)}`;
}

function to2Digits(num: number) {
	return num.toString().padStart(2, '0');
}

onMounted(() => {
	updateTimeLeft();
	interval = window.setInterval(updateTimeLeft, 1000);
});

onUnmounted(() => {
	if (interval) {
		clearInterval(interval);
	}
});
</script>

<template>
	<template v-if="isSoon">
		{{ props.countdownText }} <code>{{ timeLeft }}</code>
	</template>
	<template v-else>
		{{ props.dateText }} {{ longDateText(props.date) }}
	</template>
</template>
