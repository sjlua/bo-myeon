import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { AppColours } from "@/constants/colours";
import Shelf from "@/components/Shelf";
import { MediaItem } from "@/types/media";

// Placeholder data for continue watching
const PLACEHOLDER_CONTINUE_WATCHING: MediaItem[] = [
  { id: "1", title: "Breaking Bad", poster: "📺" },
  { id: "2", title: "Chernobyl", poster: "📺" },
  { id: "3", title: "Succession", poster: "📺" },
  { id: "4", title: "The Last of Us", poster: "📺" },
];

// Placeholder data for new shows
const PLACEHOLDER_NEW_SHOWS: MediaItem[] = [
  { id: "1", title: "New Show 1", rating: 8.5, poster: "📺" },
  { id: "2", title: "New Show 2", rating: 8.2, poster: "📺" },
  { id: "3", title: "New Show 3", rating: 8.7, poster: "📺" },
  { id: "4", title: "New Show 4", rating: 8.3, poster: "📺" },
];

// Placeholder data for new movies
const PLACEHOLDER_NEW_MOVIES: MediaItem[] = [
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
      backgroundColor: colours.background,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
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
  });

  const handleItemPress = (item: MediaItem) => {
    console.log("Item pressed:", item.title);
    // Navigate to detail screen or handle item press
  };

  const handleViewAllPress = (section: string) => {
    console.log("View all pressed:", section);
    // Navigate to full list screen
  };

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
      <Shelf
        title="Continue Watching"
        data={PLACEHOLDER_CONTINUE_WATCHING}
        showProgress={true}
        onItemPress={handleItemPress}
      />

      {/* New Shows Section */}
      <Shelf
        title="New Shows"
        data={PLACEHOLDER_NEW_SHOWS}
        showViewAll={true}
        viewAllText="See All Latest Shows"
        onViewAllPress={() => handleViewAllPress("shows")}
        onItemPress={handleItemPress}
      />

      {/* New Movies Section */}
      <Shelf
        title="New Movies"
        data={PLACEHOLDER_NEW_MOVIES}
        showViewAll={true}
        viewAllText="See All Latest Movies"
        onViewAllPress={() => handleViewAllPress("movies")}
        onItemPress={handleItemPress}
      />
    </ScrollView>
  );
}
