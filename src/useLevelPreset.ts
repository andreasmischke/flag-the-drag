import { ref, watch } from "vue";
import { LOCAL_STORAGE_KEYS } from "./config";

const LEVELS = ["beginner", "intermediate", "expert"] as const;
export type Level = (typeof LEVELS)[number];

const isValidLevel = (str: string): str is Level =>
  LEVELS.includes(str as Level);

const querySerializer = {
  read: () => new URLSearchParams(location.search).get("level"),
  write: (level: Level) => {
    const query = new URLSearchParams();
    query.set("level", level);
    history.replaceState(null, "", `?${query.toString()}`);
  },
};

const storageSerializer = {
  read: () => localStorage.getItem(LOCAL_STORAGE_KEYS.levelPreset),
  write: (level: Level) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.levelPreset, level);
  },
};

const getInitialLevel = () => {
  const levelFromQuery = querySerializer.read();
  if (levelFromQuery && isValidLevel(levelFromQuery)) {
    storageSerializer.write(levelFromQuery);
    return levelFromQuery;
  }

  const levelFromStorage = storageSerializer.read();
  if (levelFromStorage && isValidLevel(levelFromStorage)) {
    querySerializer.write(levelFromStorage);
    return levelFromStorage;
  }

  return LEVELS[0];
};

export function useLevelPreset() {
  const levelPreset = ref(getInitialLevel());

  watch(levelPreset, (level) => {
    querySerializer.write(level);
    storageSerializer.write(level);
  });

  return levelPreset;
}
