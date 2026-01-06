import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Switch,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { AppColours } from "@/constants/colours";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Settings() {
  const colorScheme = useColorScheme();
  const colours = AppColours[colorScheme || "light"];
  const isDarkMode = colorScheme === "dark";

  const toggleDarkMode = () => {
    // This is a placeholder. Replace with your actual dark mode toggle logic.
    console.log("Dark mode toggled");
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colours.background,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 24,
      color: colours.heading,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    settingLabel: {
      fontSize: 18,
      color: colours.heading,
    },
    button: {
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 16,
    },
    deleteButton: {
      backgroundColor: "#FF3B30",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.header}>Settings</Text>

      {/* Dark/Light Mode Picker */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} disabled />
      </View>

      {/* Delete Account */}
      <TouchableOpacity style={[styles.button, styles.deleteButton]}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
