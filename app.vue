<template>
  <form v-for="(match, matchIndex) in state.matches" class="match">
    <!-- Matches -->
    <section class="options">
      <label v-for="option in match">
        <input
          type="radio"
          :name="'option' + matchIndex"
          @input="advanceChosen(matchIndex, option)"
          required
        />
        {{ option }}
      </label>
    </section>

    <aside class="controls">
      <button type="reset" @click="advanceChosen(matchIndex)">Back</button>
    </aside>

    <template v-else-if="matchIndex === length - 1 && match[0]">
      <input disabled :value="match[0]" />
      {{ match[0] }}
    </template>
  </form>
</template>

<script setup lang="ts">
const options = ['A', 'B', 'C', 'D', 'E'];
const length = options.length;

const state = reactive({
  matches: [],
});

state.matches = options.map((_option, index) => [
  options[2 * index],
  options[2 * index + 1],
]);

function advanceChosen(index: number, option?: string) {
  const match = Math.floor((length + index) / 2);
  const position = (length + index) % 2;

  console.log({ match, position });

  state.matches[match][position] = option;
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.match:invalid + form,
.match:invalid .controls,
.match:valid .options {
  display: none;
}

.controls {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

button {
  pointer-events: initial;
}

.options {
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr 1fr;
  gap: 2em;
  padding: 2em;
}

.options label {
  display: grid;
  place-content: center;
  background-color: pink;
}
</style>
