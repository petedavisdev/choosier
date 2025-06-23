<script setup lang="ts">
const props = defineProps<{
  targetDate: string;
}>();

const timeLeft = ref('');
let interval: number | null = null;

function updateTimeLeft() {
  const now = new Date();
  const target = new Date(props.targetDate);
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

  timeLeft.value = `Voting closes in ${hours}h ${minutes}m ${seconds}s`;
};

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
  <h4>{{ timeLeft }}</h4>
</template>
