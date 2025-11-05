<script setup lang="ts">
import type { Level } from "@/useLevelPreset";
import LevelSelect from "./LevelSelect.vue";

defineProps<{
  gameStatus: 'ready' | 'playing' | 'win' | 'lose';
  dragons: number;
}>();

const emit = defineEmits<{
  (event: "restart"): void;
}>();

const levelPreset = defineModel<Level>("levelPreset", { required: true });
</script>

<template>
  <header class="app-header">
    <div class="title-bar">
      <h1 class="title">Flag the Drag 🐉</h1>
      <div class="right">
        <span v-if="gameStatus !== 'ready'" class="dragon-counter"
          >Dragons: {{ dragons }}</span
        >
      </div>
    </div>
    <div class="game-controls-bar">
      <LevelSelect v-model="levelPreset" />
      <button v-if="gameStatus !== 'ready'" class="restart-button" @click="emit('restart')">Restart</button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  max-width: 100vw;
  top: 0;
  left: 0;
  z-index: 1;

  background-color: light-dark(white, #121212);
  color: light-dark(#121212, #aaa);
  border-bottom: 1px solid light-dark(#eee, #333);
}
.title-bar,
.game-controls-bar {
  height: 2.5rem;
  padding-inline: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  margin: 0;
  font-size: 1rem;
  font-weight: normal;
}
</style>
