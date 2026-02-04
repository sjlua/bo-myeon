import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import { AppColours } from "@/constants/colours";
import Shelf from "@/components/Shelf";
import { MediaItem } from "@/types/media";
import { hydrateMediaItemsWithPosters } from "@/utils/omdbPosterCache";

// Seed data for continue watching
const CONTINUE_WATCHING_SEED: MediaItem[] = [
  { id: "tt0903747", title: "Breaking Bad" },
  { id: "tt7366338", title: "Chernobyl" },
  { id: "tt7660850", title: "Succession" },
  { id: "tt3581920", title: "The Last of Us" },
];

// Seed data for new shows
const NEW_SHOWS_SEED: MediaItem[] = [
  { id: "tt1312171", title: "The Umbrella Academy", rating: 8.0 },
  { id: "tt9253284", title: "The Witcher", rating: 8.0 },
  { id: "tt10293938", title: "The Bear", rating: 8.6 },
  { id: "tt9157530", title: "Stranger Things", rating: 8.7 },
];

// Seed data for new movies
const NEW_MOVIES_SEED: MediaItem[] = [
  { id: "tt15398776", title: "Oppenheimer", rating: 8.4 },
  { id: "tt6710474", title: "Everything Everywhere All at Once", rating: 7.8 },
  { id: "tt15239678", title: "Dune: Part Two", rating: 8.5 },
  { id: "tt9362722", title: "Spider-Man: Across the Spider-Verse", rating: 8.6 },
];

export default function Index() {
  const colorScheme = useColorScheme() || "dark";
  const colours = AppColours[colorScheme];
  const [continueWatching, setContinueWatching] = useState<MediaItem[]>(
    CONTINUE_WATCHING_SEED,
  );
  const [newShows, setNewShows] = useState<MediaItem[]>(NEW_SHOWS_SEED);
  const [newMovies, setNewMovies] = useState<MediaItem[]>(NEW_MOVIES_SEED);

  useEffect(() => {
    let isMounted = true;

    const hydratePosters = async () => {
      const [continuePosters, showPosters, moviePosters] = await Promise.all([
        hydrateMediaItemsWithPosters(CONTINUE_WATCHING_SEED),
        hydrateMediaItemsWithPosters(NEW_SHOWS_SEED),
        hydrateMediaItemsWithPosters(NEW_MOVIES_SEED),
      ]);

      if (!isMounted) return;
      setContinueWatching(continuePosters);
      setNewShows(showPosters);
      setNewMovies(moviePosters);
    };

    hydratePosters();

    return () => {
      isMounted = false;
    };
  }, []);

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
        data={continueWatching}
        showProgress={true}
        onItemPress={handleItemPress}
      />

      {/* New Shows Section */}
      <Shelf
        title="New Shows"
        data={newShows}
        showViewAll={true}
        viewAllText="See All Latest Shows"
        onViewAllPress={() => handleViewAllPress("shows")}
        onItemPress={handleItemPress}
      />

      {/* New Movies Section */}
      <Shelf
        title="New Movies"
        data={newMovies}
        showViewAll={true}
        viewAllText="See All Latest Movies"
        onViewAllPress={() => handleViewAllPress("movies")}
        onItemPress={handleItemPress}
      />
    </ScrollView>
  );
}
