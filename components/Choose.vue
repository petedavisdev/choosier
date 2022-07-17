<template>
  <form v-for="(match, matchIndex) in state.matches" class="match">
    <!-- Matches -->
    <template v-if="matchIndex < length - 1">
      <label v-for="(option, optionIndex) in match" :class="`option${optionIndex + 1}`">
        <input
          type="radio"
          :name="'option' + matchIndex"
          @input="advanceChosen(matchIndex, option)"
          required
        />

        <img :src="option" alt="" />
      </label>

      <aside class="controls">
        <button class="undo" title="undo" type="reset" @click="advanceChosen(matchIndex)">←</button>
        <Progress :percent="100*(matchIndex + 1)/(length - 1)" />
      </aside>
    </template>

    <template v-else-if="match[0]">
      <section>
        <img :src="match[0]" alt="" />
      </section>

      <section>
        <input disabled name="chosen" :value="match[0]" />

        <h1>To vote, please confirm that you're human</h1>

        <label for="email">Email</label>

        <input type="email" id="email" name="email" />

        <button>Send me an email</button>
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
.match {
  position: absolute;
  inset: 0;
  grid-template-rows: 1fr 1fr max-content;
  gap: 1em;
}

.match:invalid + form {
  visibility: hidden;
  pointer-events: none;
}

.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s;
}

.match:invalid .controls {
  pointer-events: none;
  opacity: 0;
}

.undo {
  border: none;
  background-color: transparent;
  font-size: xx-large;
  padding-left: 0;
}

.option1,
.option2,
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
