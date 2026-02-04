import AsyncStorage from "@react-native-async-storage/async-storage";
import { isApiConfigured, OMDB_API_KEY } from "@/config/api";
import { MediaItem } from "@/types/media";
import { getBooleanSetting } from "@/utils/settingsStorage";

const CACHE_PREFIX = "omdb:poster:";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

interface PosterCacheEntry {
  poster: string | null;
  timestamp: number;
}

const normalizeTitle = (title: string) => title.trim().toLowerCase();

const buildCacheKey = (title: string) => `${CACHE_PREFIX}${normalizeTitle(title)}`;

const readCacheEntry = async (
  title: string,
): Promise<PosterCacheEntry | null> => {
  const raw = await AsyncStorage.getItem(buildCacheKey(title));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PosterCacheEntry;
    if (typeof parsed?.timestamp !== "number") return null;
    return parsed;
  } catch {
    await AsyncStorage.removeItem(buildCacheKey(title));
    return null;
  }
};

const writeCacheEntry = async (title: string, poster: string | null) => {
  const entry: PosterCacheEntry = {
    poster,
    timestamp: Date.now(),
  };
  await AsyncStorage.setItem(buildCacheKey(title), JSON.stringify(entry));
};

const isCacheFresh = (entry: PosterCacheEntry) =>
  Date.now() - entry.timestamp < CACHE_TTL_MS;

export const clearPosterCache = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const posterKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
  if (posterKeys.length === 0) return 0;
  await AsyncStorage.multiRemove(posterKeys);
  return posterKeys.length;
};

export const getPosterForTitle = async (
  title: string,
): Promise<string | null> => {
  if (!title.trim()) return null;

  const cached = await readCacheEntry(title);
  if (cached && isCacheFresh(cached)) {
    return cached.poster ?? null;
  }

  const reducedDataMode = await getBooleanSetting("reducedDataMode", false);
  if (reducedDataMode) {
    return cached?.poster ?? null;
  }

  if (!isApiConfigured()) {
    return cached?.poster ?? null;
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`,
    );
    const data = await response.json();

    if (data?.Response === "True" && data?.Poster && data.Poster !== "N/A") {
      await writeCacheEntry(title, data.Poster);
      return data.Poster as string;
    }

    await writeCacheEntry(title, null);
    return null;
  } catch (error) {
    console.error("Poster lookup failed:", error);
    return null;
  }
};

export const hydrateMediaItemsWithPosters = async (
  items: MediaItem[],
): Promise<MediaItem[]> => {
  return Promise.all(
    items.map(async (item) => {
      if (item.poster && item.poster !== "N/A") return item;
      const poster = await getPosterForTitle(item.title);
      return {
        ...item,
        poster,
      };
    }),
  );
};
