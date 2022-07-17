<template>
  <aside class="controls">
    <button class="undo" title="undo" type="button" disabled>←</button>
    <Progress :percent="0" />
  </aside>

  <form v-for="(match, matchIndex) in state.matches" class="match">
    <div class="grid" v-if="matchIndex < length - 1">
      <label v-for="(option, optionIndex) in match" :class="`option${optionIndex + 1}`">
        <input
          type="radio"
          :name="'option' + matchIndex"
          @input="advanceChosen(matchIndex, option)"
          required
        />

        <img :src="option" alt="" />
      </label>
    </div>

    <div class="grid" v-else-if="match[0]">
      <section>
        <img :src="match[0]" alt="" />
      </section>

      <section class="vote">
        <input disabled name="chosen" :value="match[0]" />

        <h1>To vote, please confirm that you're human</h1>

        <label for="email">Email</label>

        <input type="email" id="email" name="email" />

        <button>Send me an email</button>
      </section>
    </div>

    <aside class="controls">
      <button class="undo" title="undo" type="reset" @click="advanceChosen(matchIndex)">←</button>
      <Progress :percent="100*(matchIndex + 1)/(length - 1)" />
    </aside>
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
  inset: 0 0 4em 0;
  transition: opacity 0.5s 0.5s;
  z-index: 1;
}

.grid {
  grid-template-rows: 1fr 1fr;
  gap: 1em;
}

.match:invalid + .match {
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}

.controls {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 1s;
}

.match:invalid .controls {
  pointer-events: none;
  opacity: 0;
}

.match:valid .controls {
  z-index: 1;
}

.undo {
  border: none;
  background-color: transparent;
  font-size: xx-large;
  padding-left: 0;
}

.undo:disabled {
  color: silver;
}

.grid > * {
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
  position: absolute;
  opacity: 0;
}

img {
  object-fit: contain;
  max-height: calc(50vh - 3em);
  border-radius: 0.5em;
  box-shadow: 0 2px 5px #0003;
}

label:focus-within img {
  outline: var(--darker) 3px solid;
  outline-offset: -3px;
}

.vote {
  display: grid;
  place-content: center;
  height: 100%;
  background-color: var(--lighter);
}
</style>
