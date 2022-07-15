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
        <button class="undo" title="undo" type="reset" @click="advanceChosen(matchIndex)">←</button>
        <Progress :percent="100*(matchIndex + 1)/(length - 1)" />
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
}

.undo {
  border: none;
  background-color: transparent;
  font-size: xx-large;
  padding-left: 0;
}

.options,
.chosen {
  position: fixed;
  inset: 0;
  display: grid;
  height: 100%;
  grid-template-rows: 1fr 1fr;
  pointer-events: none;
}

.options label,
.chosen div {
  display: grid;
  place-content: center;
  pointer-events: initial;
  margin: 1em;
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
  object-fit: contain;
  max-height: calc(50vh - 3em);
  border-radius: 0.5em;
  box-shadow: 0 2px 5px #0003;
}
</style>
