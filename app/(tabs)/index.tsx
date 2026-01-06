import {
  ScrollView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppColours } from "@/constants/colours";
import { useColorScheme } from "react-native";

// Placeholder data for continue watching
const PLACEHOLDER_CONTINUE_WATCHING = [
  { id: "1", title: "Breaking Bad", progress: 65, poster: "📺" },
  { id: "2", title: "Chernobyl", progress: 42, poster: "📺" },
  { id: "3", title: "Succession", progress: 88, poster: "📺" },
  { id: "4", title: "The Last of Us", progress: 25, poster: "📺" },
];

// Placeholder data for new shows
const PLACEHOLDER_NEW_SHOWS = [
  { id: "1", title: "New Show 1", rating: 8.5, poster: "📺" },
  { id: "2", title: "New Show 2", rating: 8.2, poster: "📺" },
  { id: "3", title: "New Show 3", rating: 8.7, poster: "📺" },
  { id: "4", title: "New Show 4", rating: 8.3, poster: "📺" },
];

// Placeholder data for new movies
const PLACEHOLDER_NEW_MOVIES = [
  { id: "1", title: "New Movie 1", rating: 8.6, poster: "🎬" },
  { id: "2", title: "New Movie 2", rating: 8.9, poster: "🎬" },
  { id: "3", title: "New Movie 3", rating: 8.4, poster: "🎬" },
  { id: "4", title: "New Movie 4", rating: 8.8, poster: "🎬" },
];

export default function Index() {
  const colorScheme = useColorScheme() || "dark";
  const colours = AppColours[colorScheme];

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
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: colours.heading,
      marginBottom: 8,
    },
    headerDescription: {
      fontSize: 14,
      color: colours.description,
      lineHeight: 20,
    },
    sectionContainer: {
      marginTop: 28,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colours.heading,
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    sectionViewAll: {
      paddingHorizontal: 20,
      marginTop: 12,
    },
    viewAllButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colours.navBarBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colours.buttonBgColours,
      alignItems: "center",
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: "600",
      color: colours.navBarButtonFocused,
    },
    posterCard: {
      marginRight: 16,
      marginBottom: 8,
    },
    posterImage: {
      width: 120,
      height: 180,
      borderRadius: 8,
      backgroundColor: colours.buttonBgColours,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
      overflow: "hidden",
    },
    posterEmoji: {
      fontSize: 48,
    },
    posterTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: colours.heading,
      marginBottom: 4,
      width: 120,
    },
    posterRating: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingText: {
      fontSize: 12,
      color: colours.rating,
      marginLeft: 4,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    progressText: {
      fontSize: 12,
      color: colours.description,
      marginLeft: 4,
    },
    progressBar: {
      height: 4,
      backgroundColor: colours.buttonBgColours,
      borderRadius: 2,
      marginTop: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: 4,
      backgroundColor: colours.navBarButtonFocused,
      borderRadius: 2,
    },
    contentContainerStyle: {
      paddingHorizontal: 20,
    },
  });

  const PosterCard = ({ item, showProgress = false }) => (
    <View style={styles.posterCard}>
      <View style={styles.posterImage}>
        <Text style={styles.posterEmoji}>{item.poster}</Text>
      </View>
      <Text style={styles.posterTitle} numberOfLines={2}>
        {item.title}
      </Text>
      {showProgress ? (
        <View>
          <View style={styles.progressContainer}>
            <Ionicons name="play" size={14} color={colours.description} />
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${item.progress}%` }]}
            />
          </View>
        </View>
      ) : (
        <View style={styles.posterRating}>
          <Ionicons name="star" size={14} color={colours.ratingStars} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Bo Myeon</Text>
        <Text style={styles.headerDescription}>
          The name of the app was inspired by 보면, which literally means if you
          see/watch/try.
        </Text>
      </View>

      {/* Continue Watching Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Continue Watching</Text>
        <FlatList
          data={PLACEHOLDER_CONTINUE_WATCHING}
          renderItem={({ item }) => (
            <PosterCard item={item} showProgress={true} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          scrollEnabled
        />
      </View>

      {/* New Shows Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>New Shows</Text>
        <FlatList
          data={PLACEHOLDER_NEW_SHOWS}
          renderItem={({ item }) => <PosterCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          scrollEnabled
        />
        <View style={styles.sectionViewAll}>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>See All Latest Shows</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* New Movies Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>New Movies</Text>
        <FlatList
          data={PLACEHOLDER_NEW_MOVIES}
          renderItem={({ item }) => <PosterCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          scrollEnabled
        />
        <View style={styles.sectionViewAll}>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>See All Latest Movies</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
