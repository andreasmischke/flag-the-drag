import { onBeforeUnmount, ref, type Ref } from "vue";

export function useKeyboardControls(
  sizeX: Ref<number>,
  sizeY: Ref<number>,
  handleClick: (type: "left" | "right", x: number, y: number) => void,
  restart: () => void,
) {
  const keyX = ref(0);
  const keyY = ref(0);
  const showKeyFocus = ref(false);

  const abortController = new AbortController();
  window.addEventListener(
    "keydown",
    (e) => {
      showKeyFocus.value = true;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          keyY.value = (keyY.value - 1 + sizeY.value) % sizeY.value;
          break;
        case "ArrowDown":
          e.preventDefault();
          keyY.value = (keyY.value + 1) % sizeY.value;
          break;
        case "ArrowLeft":
          e.preventDefault();
          keyX.value = (keyX.value - 1 + sizeX.value) % sizeX.value;
          break;
        case "ArrowRight":
          e.preventDefault();
          keyX.value = (keyX.value + 1) % sizeX.value;
          break;
        case "Enter":
          e.preventDefault();
          handleClick("left", keyX.value, keyY.value);
          break;
        case " ":
          e.preventDefault();
          handleClick("right", keyX.value, keyY.value);
          break;
        case "r":
          if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
            e.preventDefault();
            restart();
          }
          break;
        default:
          showKeyFocus.value = false;
          break;
      }
    },
    { signal: abortController.signal },
  );
  onBeforeUnmount(() => {
    abortController.abort();
  });

  return { keyX, keyY, showKeyFocus };
}
