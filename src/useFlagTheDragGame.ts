import { computed, type MaybeRefOrGetter, onBeforeUnmount, ref, shallowRef, toValue, watch } from 'vue'
import { FlagTheDragGame } from './FlagTheDragGame'

export function useFlagTheDragGame(
  levelRef: MaybeRefOrGetter<
    'beginner' | 'intermediate' | 'expert' | { x: number; y: number; dragonCount: number }
  >,
) {
  const restartTrigger = ref(0)
  const config = computed(() => {
    const level = toValue(levelRef)
    switch (level) {
      case 'beginner':
        return { x: 9, y: 9, dragonCount: 10 }
      case 'intermediate':
        return { x: 16, y: 16, dragonCount: 40 }
      case 'expert':
        return { x: 30, y: 16, dragonCount: 99 }
      default:
        return level
    }
  })

  let game = new FlagTheDragGame(config.value.x, config.value.y, config.value.dragonCount)
  const gameState = shallowRef(game.getState())
  let abortSignal = new AbortController()
  game.addEventListener(
    'update',
    () => {
      gameState.value = game.getState()
    },
    { signal: abortSignal.signal },
  )
  watch([config, restartTrigger], ([{ x, y, dragonCount }]) => {
    abortSignal.abort()
    game = new FlagTheDragGame(x, y, dragonCount)
    gameState.value = game.getState()
    abortSignal = new AbortController()
    game.addEventListener(
      'update',
      () => {
        gameState.value = game.getState()
      },
      { signal: abortSignal.signal },
    )
  })

  onBeforeUnmount(() => {
    abortSignal.abort()
  })

  return {
    state: gameState,
    restart: () => {
      restartTrigger.value++
    },
    handleClick: (type: "left" | "right", x: number, y: number) => {
      game.handleClick(type, x, y)
    }
  }
}
