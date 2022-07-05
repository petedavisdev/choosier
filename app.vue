<template>
  <ol reversed>
    <li v-for="(pair, index) in pairs">
      <label>
        <input type="radio" :name="index" @click="advanceChosen(pair[0])" />
        {{ pair[0] }}
      </label>

      <label>
        <input type="radio" :name="index" @click="advanceChosen(pair[1])" />
        {{ pair[1] }}
      </label>
    </li>
  </ol>
</template>

<script setup lang="ts">
const images = ['One', 'Two', 'Three', 'Four', 'Five'];

const pairs = ref(
  images.map((image, index) => {
    const a = images[2 * index];
    const b = images[2 * index + 1];
    if (b) return [a, b];
    if (a) return [a];
    return [];
  })
);

function advanceChosen(chosen) {
  const nextPair =
    pairs.value.find((two) => two.length === 1) ||
    pairs.value.find((two) => two.length === 0);
  nextPair.push(chosen);
}
</script>
