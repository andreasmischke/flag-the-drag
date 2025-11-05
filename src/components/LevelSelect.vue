<script setup lang="ts">
import type { Level } from "@/useLevelPreset";

const levelPreset = defineModel<Level>({ required: true });
</script>

<template>
  <label
    >Level:
    <select class="level-preset" v-model="levelPreset">
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="expert">Expert</option>
    </select></label
  >
</template>
