import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppColours } from "@/constants/colours";
import { OMDB_API_KEY, isApiConfigured } from "@/config/api";

const SEARCH_SUGGESTIONS = [
  { id: "1", label: "Popular", icon: "flame" },
  { id: "2", label: "Top Rated", icon: "star" },
  { id: "3", label: "Trending", icon: "trending-up" },
  { id: "4", label: "Upcoming", icon: "calendar" },
];

type SearchDatabase = "imdb" | "tvdb";

interface SearchError {
  message: string;
  code?: string;
}

export default function Search() {
  // Theming
  const colorScheme = useColorScheme() || "dark";
  const colours = AppColours[colorScheme];

  // Searching
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDatabase, setSelectedDatabase] =
    useState<SearchDatabase>("imdb");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<SearchError | null>(null);

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
      paddingBottom: 20,
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
      borderRadius: 24,
      paddingHorizontal: 12,
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
    },
    suggestionText: {
      fontSize: 16,
      fontWeight: "500",
      color: colours.heading,
    },
    databaseToggle: {
      flexDirection: "row",
      gap: 8,
      marginVertical: 16,
    },
    databaseButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    databaseButtonActive: {
      borderColor: colours.navBarButtonFocused,
      backgroundColor: colours.navBarButtonFocused,
    },
    databaseButtonInactive: {
      borderColor: colours.buttonBgColours,
      backgroundColor: colours.navBarBackground,
    },
    databaseButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    databaseButtonTextActive: {
      color: colours.navBarBackground,
    },
    databaseButtonTextInactive: {
      color: colours.heading,
    },
    searchResultsContainer: {
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    resultItem: {
      backgroundColor: colours.navBarBackground,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      flexDirection: "row",
      gap: 12,
    },
    resultPoster: {
      width: 60,
      height: 90,
      borderRadius: 6,
      backgroundColor: colours.buttonBgColours,
    },
    resultContent: {
      flex: 1,
      justifyContent: "center",
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colours.heading,
      marginBottom: 4,
    },
    resultSubtitle: {
      fontSize: 13,
      color: colours.description,
      marginBottom: 8,
    },
    noResultsText: {
      fontSize: 14,
      color: colours.description,
      textAlign: "center",
      marginTop: 24,
    },
    loadingContainer: {
      paddingTop: 24,
      alignItems: "center",
    },
  });

  const handleSearch = async () => {
    // Clear previous results and errors if query is empty
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setSearchError(null);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setSearchError(null);

    // Perform search based on selected database
    try {
      if (selectedDatabase === "imdb") {
        await searchIMDb(searchQuery);
      } else {
        await searchTVDB(searchQuery);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // IMDb Search using OMDb API
  const searchIMDb = async (query: string) => {
    if (!isApiConfigured()) {
      const errorMsg =
        "OMDb API key is not configured. Please set EXPO_PUBLIC_OMDB_API_KEY in your .env.local file.";
      console.error(errorMsg);
      setSearchError({
        message: errorMsg,
        code: "NO_API_KEY",
      });
      setSearchResults([]);
      return;
    }

    // Fetch search results from OMDb API
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`,
      );
      const data = await response.json();

      // Handle OMDb API responses - treat "not found" as empty results (normalize with TV Maze)
      if (data.Response === "False") {
        // "Movie not found!" and similar responses are treated as empty results, not errors
        console.log("OMDb search returned no results:", data.Error);
        setSearchResults([]);
        setSearchError(null);
        return;
      }

      if (data.Search && data.Search.length > 0) {
        setSearchResults(
          data.Search.map((item: any) => ({
            id: item.imdbID,
            title: item.Title,
            year: item.Year,
            type: item.Type,
            poster: item.Poster,
            source: "imdb",
          })),
        );
        setSearchError(null);
      } else {
        setSearchResults([]);
        setSearchError(null);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Network error while searching IMDb";
      console.error("IMDb search error:", error);
      setSearchError({
        message: errorMsg,
        code: "NETWORK_ERROR",
      });
      setSearchResults([]);
    }
  };

  // TVDB Search using TVMaze API
  const searchTVDB = async (query: string) => {
    try {
      // Using TVMaze API as a free TVDB alternative (no key required)
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setSearchResults(
          data.map((item: any) => ({
            id: item.show.id,
            title: item.show.name,
            year: item.show.premiered
              ? new Date(item.show.premiered).getFullYear()
              : "N/A",
            type: "series",
            poster: item.show.image?.medium || null,
            source: "tvdb",
            status: item.show.status,
            language: item.show.language,
          })),
        );
        setSearchError(null);
      } else {
        setSearchResults([]);
        setSearchError(null);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Network error while searching TV Maze";
      console.error("TVDB search error:", error);
      setSearchError({
        message: errorMsg,
        code: "NETWORK_ERROR",
      });
      setSearchResults([]);
    }
  };

  // Render a single search result item
  const renderResultItem = (result: any) => (
    <TouchableOpacity key={result.id} style={styles.resultItem}>
      {result.poster && result.poster !== "N/A" ? (
        <Image
          source={{ uri: result.poster }}
          style={styles.resultPoster}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.resultPoster} />
      )}
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{result.title}</Text>
        <Text style={styles.resultSubtitle}>
          {result.year} • {result.type}
          {result.status ? ` • ${result.status}` : ""}
        </Text>
        {result.language && (
          <Text style={styles.resultSubtitle}>Language: {result.language}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

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
            placeholder="Search for your next watch..."
            placeholderTextColor={colours.description}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={20} color={colours.description} />
            </TouchableOpacity>
          )}
        </View>

        {/* Database Selectors */}
        <View style={styles.databaseToggle}>
          <TouchableOpacity
            style={[
              styles.databaseButton,
              selectedDatabase === "imdb"
                ? styles.databaseButtonActive
                : styles.databaseButtonInactive,
            ]}
            onPress={() => {
              setSelectedDatabase("imdb");
              setSearchResults([]);
              setHasSearched(false);
            }}
          >
            <Text
              style={[
                styles.databaseButtonText,
                selectedDatabase === "imdb"
                  ? styles.databaseButtonTextActive
                  : styles.databaseButtonTextInactive,
              ]}
            >
              IMDb
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.databaseButton,
              selectedDatabase === "tvdb"
                ? styles.databaseButtonActive
                : styles.databaseButtonInactive,
            ]}
            onPress={() => {
              setSelectedDatabase("tvdb");
              setSearchResults([]);
              setHasSearched(false);
            }}
          >
            <Text
              style={[
                styles.databaseButtonText,
                selectedDatabase === "tvdb"
                  ? styles.databaseButtonTextActive
                  : styles.databaseButtonTextInactive,
              ]}
            >
              TV Maze
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Results */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colours.navBarButtonFocused} />
        </View>
      )}

      {hasSearched &&
        !isLoading &&
        searchResults.length === 0 &&
        !searchError && (
          <Text style={styles.noResultsText}>
            No results found for {searchQuery}.
          </Text>
        )}

      {/* All search results */}
      {searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={({ item, index }) => renderResultItem(item)} // index is taken and used below (implicitly)
            // keyExtractor: Combine ID + index to ensure unique keys
            // Problem: OMDb can return duplicate movies (re-releases, different editions)
            // Solution: Using just item.id caused "duplicate key" warning when same movie appeared twice
            // Fix: Append array index to ID (e.g., "tt0944947-0", "tt0944947-1") for uniqueness
            keyExtractor={(item, index) => `${item.id}-${index}`}
            scrollEnabled={false}
            nestedScrollEnabled={false}
          />
        </View>
      )}

      {/* Suggestions Section - show when no search */}
      {!hasSearched && (
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
      )}
    </ScrollView>
  );
}
