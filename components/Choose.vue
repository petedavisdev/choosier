<template>
  <form v-for="(match, matchIndex) in state.matches" class="match">
    <!-- Matches -->
    <template v-if="matchIndex < length - 1">
      <section class="options">
        <label v-for="option in match">
          <input
            type="radio"
            :name="'option' + matchIndex"
            @input="advanceChosen(matchIndex, option)"
            required
          />

          <img :src="option" alt="" />
        </label>
      </section>

      <aside class="controls">
        <button type="reset" @click="advanceChosen(matchIndex)">Back</button>
      </aside>
    </template>

    <template v-else-if="match[0]">
      <section class="chosen">
        <div>
          <img :src="match[0]" alt="" />
        </div>

        <div>
          <input disabled name="chosen" :value="match[0]" />

          <h1>To vote, please confirm that you're human</h1>

          <label for="email">Email</label>

          <input type="email" id="email" name="email" />

          <button>Send me an email</button>
        </div>
      </section>
    </template>
  </form>
</template>

<script setup lang="ts">
import options from '../chocolate.json';
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

.options,
.chosen {
  display: grid;
  height: calc(100vh - 4em);
  grid-template-rows: 1fr 1fr;
  gap: 2em;
}

.options label {
  display: grid;
  place-content: center;
}

.chosen {
  place-content: center;
}

input {
  display: block;
}

[type="radio"] {
  display: none;
}

img {
  max-height: calc(50vh - 3em);
}
</style>
