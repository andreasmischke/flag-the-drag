import { onBeforeUnmount, watch } from "vue";

export function useUnloadConfirmation(
  gameStatusGetter: () => "playing" | string,
) {
  let abortController = new AbortController();

  watch(
    gameStatusGetter,
    (status) => {
      if (status === "playing") {
        abortController = new AbortController();
        window.addEventListener(
          "beforeunload",
          (event) => {
            event.preventDefault();
            return (event.returnValue =
              "Do you want to leave? Your game progress will be lost.");
          },
          { signal: abortController.signal },
        );
      } else {
        abortController.abort();
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    abortController.abort();
  });
}
