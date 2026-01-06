import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppColours } from "@/constants/colours";

const SEARCH_SUGGESTIONS = [
  { id: "1", label: "Popular", icon: "flame" },
  { id: "2", label: "Top Rated", icon: "star" },
  { id: "3", label: "Trending", icon: "trending-up" },
  { id: "4", label: "Upcoming", icon: "calendar" },
];

export default function Search() {
  const colorScheme = useColorScheme() || "dark";
  const colours = AppColours[colorScheme];
  const [searchQuery, setSearchQuery] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colours.background,
    },
    contentContainer: {
      paddingBottom: 40,
    },
    headerSection: {
      backgroundColor: colours.navBarBackground,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: colours.buttonBgColours,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colours.heading,
      marginBottom: 16,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colours.background,
      borderRadius: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colours.buttonBgColours,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colours.heading,
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    suggestionsSection: {
      paddingHorizontal: 20,
      paddingTop: 28,
    },
    browseLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colours.description,
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    suggestionsContainer: {
      gap: 8,
    },
    suggestionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: colours.navBarBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colours.buttonBgColours,
    },
    suggestionText: {
      fontSize: 16,
      fontWeight: "500",
      color: colours.heading,
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Search</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={colours.description}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for watches..."
            placeholderTextColor={colours.description}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Suggestions Section */}
      <View style={styles.suggestionsSection}>
        <Text style={styles.browseLabel}>Browse</Text>

        <View style={styles.suggestionsContainer}>
          {SEARCH_SUGGESTIONS.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionButton}
            >
              <Ionicons
                name={suggestion.icon as any}
                size={20}
                color={colours.navBarButtonFocused}
                style={{ marginRight: 12 }}
              />
              <Text style={styles.suggestionText}>{suggestion.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
