import AsyncStorage from "@react-native-async-storage/async-storage";
import { MediaItem } from "@/types/media";

const STORAGE_KEY = "currentlyWatching";

const safeParse = (raw: string | null): MediaItem[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as MediaItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error("Failed to parse currently watching:", error);
    return [];
  }
};

export const getCurrentlyWatching = async (): Promise<MediaItem[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return safeParse(raw);
  } catch (error) {
    console.error("Failed to read currently watching:", error);
    return [];
  }
};

export const setCurrentlyWatching = async (
  items: MediaItem[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save currently watching:", error);
  }
};

export const addToCurrentlyWatching = async (
  item: MediaItem,
): Promise<MediaItem[]> => {
  const current = await getCurrentlyWatching();
  const exists = current.some((entry) => entry.id === item.id);
  if (exists) return current;

  const next = [item, ...current];
  await setCurrentlyWatching(next);
  return next;
};

export const removeFromCurrentlyWatching = async (
  id: string,
): Promise<MediaItem[]> => {
  const current = await getCurrentlyWatching();
  const next = current.filter((entry) => entry.id !== id);
  await setCurrentlyWatching(next);
  return next;
};

export const updateCurrentlyWatchingRating = async (
  id: string,
  rating: number,
): Promise<MediaItem[]> => {
  const current = await getCurrentlyWatching();
  const next = current.map((entry) =>
    entry.id === id ? { ...entry, rating } : entry,
  );
  await setCurrentlyWatching(next);
  return next;
};
