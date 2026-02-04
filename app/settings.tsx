import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  useColorScheme,
  StyleSheet,
  Alert,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { AppColours } from "@/constants/colours";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { isApiConfigured } from "@/config/api";
import { getBooleanSetting, setBooleanSetting } from "@/utils/settingsStorage";
import { clearPosterCache } from "@/utils/omdbPosterCache";
import { setCurrentlyWatching } from "@/utils/currentlyWatchingStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const colorScheme = useColorScheme();
  const colours = AppColours[colorScheme || "light"];
  const isDarkMode = colorScheme === "dark";
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);
  const [reducedDataMode, setReducedDataMode] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const reducedData = await getBooleanSetting("reducedDataMode", false);
      setReducedDataMode(reducedData);
    };

    loadSettings();
  }, []);

  const handleToggle = async (key: "reducedDataMode", value: boolean) => {
    await setBooleanSetting(key, value);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "This will reset your name, description, and clear your currently watching list. This cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await AsyncStorage.removeItem("profileName");
            await AsyncStorage.removeItem("profileDescription");
            await setCurrentlyWatching([]);
          },
          style: "destructive",
        },
      ],
    );
  };

  const handleClearPosterCache = async () => {
    setIsClearingCache(true);
    setCacheMessage(null);
    try {
      const removed = await clearPosterCache();
      setCacheMessage(
        removed > 0
          ? `Cleared ${removed} cached posters.`
          : "No cached posters to clear.",
      );
    } catch (error) {
      console.error("Failed to clear poster cache:", error);
      setCacheMessage("Failed to clear cache. Try again.");
    } finally {
      setIsClearingCache(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colours.background,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 8,
      color: colours.heading,
    },
    subHeader: {
      fontSize: 13,
      color: colours.description,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colours.description,
      marginTop: 20,
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    settingLabel: {
      fontSize: 16,
      color: colours.heading,
    },
    settingDescription: {
      fontSize: 12,
      color: colours.description,
      marginTop: 4,
      maxWidth: "88%",
    },
    settingTextContainer: {
      flex: 1,
      paddingRight: 12,
    },
    button: {
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    deleteButton: {
      backgroundColor: "#FF3B30",
    },
    secondaryButton: {
      backgroundColor: colours.navBarBackground,
      borderWidth: 1,
      borderColor: colours.buttonBgColours,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    secondaryButtonText: {
      color: colours.heading,
    },
    cacheMessage: {
      marginTop: 8,
      fontSize: 12,
      color: colours.description,
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.header}>Settings</Text>
      <Text style={styles.subHeader}>
        Manage how Bo Myeon behaves on this device.
      </Text>

      <Text style={styles.sectionTitle}>Data & Storage</Text>
      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Reduced Data Mode</Text>
          <Text style={styles.settingDescription}>
            Use cached posters only and skip new downloads.
          </Text>
        </View>
        <Switch
          value={reducedDataMode}
          onValueChange={(value) => {
            setReducedDataMode(value);
            handleToggle("reducedDataMode", value);
          }}
        />
      </View>

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Poster Cache</Text>
          <Text style={styles.settingDescription}>
            Stored locally to reduce repeated API calls.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleClearPosterCache}
          disabled={isClearingCache}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            {isClearingCache ? "Clearing..." : "Clear Cache"}
          </Text>
        </TouchableOpacity>
      </View>
      {cacheMessage && <Text style={styles.cacheMessage}>{cacheMessage}</Text>}

      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Clear Currently Watching</Text>
          <Text style={styles.settingDescription}>
            Remove all shows from your currently watching list.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => {
            Alert.alert(
              "Clear Currently Watching",
              "Are you sure you want to remove all shows from your currently watching list? This cannot be undone.",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "Clear",
                  onPress: async () => {
                    await setCurrentlyWatching([]);
                  },
                  style: "destructive",
                },
              ],
            );
          }}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
