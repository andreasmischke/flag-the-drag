<script setup lang="ts">
defineProps<{
  gameStatus: "ready" | "playing" | "win" | "lose";
}>();
</script>

<template>
  <div class="container">
    <Transition name="slide-down">
      <div v-if="gameStatus === 'win'" class="message win">
        You flagged all the dragons! 🏆
      </div>
    </Transition>
    <Transition name="slide-down">
      <div v-if="gameStatus === 'lose'" class="message lose">
        Ouch! You got bitten by a dragon 🐉
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.container {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
}
.message {
  font-size: 1rem;
  line-height: 2rem;
  text-align: center;
  overflow: hidden;
  max-height: 2rem;
  color: light-dark(black, white);
}
.win {
  background: light-dark(lightgreen, darkgreen);
}
.lose {
  background: light-dark(lightcoral, darkred);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    max-height 250ms ease-in-out,
    color 250ms linear;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0rem;
  color: transparent;
}
</style>
