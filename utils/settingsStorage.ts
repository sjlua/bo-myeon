import AsyncStorage from "@react-native-async-storage/async-storage";

export type BooleanSettingKey =
  | "reducedDataMode"
  | "enableNotifications"
  | "enableHaptics"
  | "autoPlayTrailers"
  | "spoilerFreeMode";

const SETTINGS_PREFIX = "settings:";

const keyFor = (key: BooleanSettingKey) => `${SETTINGS_PREFIX}${key}`;

export const getBooleanSetting = async (
  key: BooleanSettingKey,
  defaultValue: boolean,
): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(keyFor(key));
    if (raw === null) return defaultValue;
    return raw === "true";
  } catch (error) {
    console.error("Failed to read setting:", key, error);
    return defaultValue;
  }
};

export const setBooleanSetting = async (
  key: BooleanSettingKey,
  value: boolean,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(keyFor(key), value ? "true" : "false");
  } catch (error) {
    console.error("Failed to save setting:", key, error);
  }
};
