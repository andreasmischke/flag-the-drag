<script setup lang="ts">
defineProps<{
  isTouchDevice: boolean
}>()

const isFlagging = defineModel<boolean>()
</script>

<template>
  <footer v-if="isTouchDevice" class="footer controls">
    <label class="toggle">
      <span class="toggle__icon-dig">🪏</span>
      <span class="toggle__icon-flag">🚩</span>
      <input type="checkbox" name="isFlagging" v-model="isFlagging" class="checkbox" />
    </label>
    <!-- <button class="control-button" :class="{ active: !isFlagging }" @click="isFlagging = false">
      🪏
    </button>
    <button class="control-button" :class="{ active: isFlagging }" @click="isFlagging = true">
      🚩
    </button> -->
  </footer>
</template>

<style scoped>
.footer {
  position: sticky;
  max-width: 100vw;
  bottom: 0;
  left: 0;

  background-color: light-dark(white, #121212);
  color: light-dark(#121212, #aaa);
  border-top: 1px solid light-dark(#eee, #333);

  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.toggle {
  height: 2rem;
  width: 4rem;
  border-radius: 0.5rem;
  background-color: light-dark(#eee, #333);

  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  text-align: center;

  .toggle__icon-dig,
  .toggle__icon-flag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    z-index: 2;
  }

  .toggle__icon-flag,
  &:has(:checked) .toggle__icon-dig {
    opacity: 0.75;
  }
  .toggle__icon-dig,
  &:has(:checked) .toggle__icon-flag {
    opacity: 1;
  }


  &::before {
    content: '';
    width: 1.8rem;
    height: 1.8rem;
    z-index: 1;
    position: absolute;
    top: 0.1rem;
    left: 0.15rem;
    background-color: #555;
    border-radius: 0.4rem;
    transition: transform 100ms ease-in-out;
  }

  &:has(:checked)::before {
    transform: translateX(1.9rem);
  }
}
.checkbox {
  display: none;
}

.controls {
  display: flex;
  justify-content: center;
}
.control-button {
  background-color: lightgray;
  border: outset 4px #eee;
  padding-inline: 0.5rem;
  &.active {
    border: solid 4px lightgray;
  }
}
</style>
