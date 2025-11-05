<script setup lang="ts">
import { computed, ref } from "vue";
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
import WinLoseMessage from "./components/WinLoseMessage.vue";
import { useFlagTheDragGame } from "./useFlagTheDragGame";
import { useKeyboardControls } from "./useKeyboardControls";
import { useLevelPreset } from "./useLevelPreset";
import { useUnloadConfirmation } from "./useUnloadConfirmation";

const levelPreset = useLevelPreset();
const { state, restart, handleClick } = useFlagTheDragGame(levelPreset);

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

const { keyX, keyY, showKeyFocus } = useKeyboardControls(
  computed(() => state.value.board.length),
  computed(() => state.value.board[0]!.length),
  handleClick,
  restart,
);

useUnloadConfirmation(() => state.value.status);

const isFlagging = ref(false);
const handleTouchOrClick = (x: number, y: number) => {
  keyX.value = x;
  keyY.value = y;
  showKeyFocus.value = false;

  if (!isTouchDevice) {
    handleClick("left", x, y);
    return;
  }
  handleClick(isFlagging.value ? "right" : "left", x, y);
};
</script>

<template>
  <AppHeader
    :game-status="state.status"
    :dragons="state.remainingDragons"
    v-model:level-preset="levelPreset"
    @restart="restart"
  />
  <main class="frame">
    <WinLoseMessage :game-status="state.status" />
    <div class="board">
      <div v-for="(row, x) in state.board" :key="x" class="row">
        <button
          v-for="(cell, y) in row"
          :key="y"
          class="cell"
          :class="{
            revealed: cell.revealed,
            focused: showKeyFocus && x === keyX && y === keyY,
          }"
          @click="handleTouchOrClick(x, y)"
          @click.right.prevent="handleClick('right', x, y)"
        >
          <span class="cell-value">{{ cell.symbol }} </span>
          <span
            v-if="cell.revealed && cell.symbol === '🐉'"
            class="cell-cross"
          />
        </button>
      </div>
    </div>
  </main>
  <AppFooter :is-touch-device v-model="isFlagging" />
</template>

<style scoped>
.frame {
  flex: 1 1;
  overflow: auto;
  font-family: sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: light-dark(white, black);
}
.board {
  display: flex;
  flex-direction: row;
  padding: 1rem;
  width: fit-content;
  margin-inline: auto;
}
.row {
  display: flex;
  flex-direction: column;
}
.cell {
  position: relative;
  width: 40px;
  height: 40px;
  overflow: hidden;
  background-color: light-dark(lightgray, #333);
  margin: 0;
  border: 4px outset light-dark(#eee, #555);
}
.cell-value {
  position: absolute;
  inset: 0;
  line-height: 30px;
}
.cell-cross {
  position: absolute;
  background-color: light-dark(red, darkred);
  top: 50%;
  left: -50%;
  right: -50%;
  transform: translateY(-1px) rotate(45deg);
  height: 2px;
}
.cell-cross::after {
  content: "";
  position: absolute;
  background-color: light-dark(red, darkred);
  top: 50%;
  left: -50%;
  right: -50%;
  transform: translateY(-1px) rotate(90deg);
  height: 2px;
}
.cell:active,
.cell.revealed {
  background-color: light-dark(lightgray, #311f08);
  border: 4px solid light-dark(lightgray, #311f08);
}
.cell.focused {
  box-shadow: inset 0 0 0 2px blue;
}
</style>
