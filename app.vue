<template>
  <ol start="0">
    <li v-for="(match, index) in matches">
      <label>
        <input
          type="radio"
          :name="index"
          @click="advanceChosen(match[0], index)"
        />
        {{ match[0] }}
      </label>

      <label>
        <input
          type="radio"
          :name="index"
          @click="advanceChosen(match[1], index)"
        />
        {{ match[1] }}
      </label>
    </li>
  </ol>
  <p>{{ test }}</p>
</template>

<script setup lang="ts">
const images = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const length = images.length;

const matches = ref(
  images.map((image, index) => {
    const a = images[2 * index];
    const b = images[2 * index + 1];
    if (b) return [a, b];
    if (a) return [a];
    return [];
  })
);

function advanceChosen(chosen, index) {
  const match = Math.floor((length + index) / 2);
  const position = (length + index) % 2;

  matches.value[match][position] = chosen;
}
</script>
