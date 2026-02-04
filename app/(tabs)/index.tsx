import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppColours } from "@/constants/colours";
import Shelf from "@/components/Shelf";
import { MediaItem } from "@/types/media";
import { hydrateMediaItemsWithPosters } from "@/utils/omdbPosterCache";
import { getCurrentlyWatching } from "@/utils/currentlyWatchingStorage";
import { useFocusEffect } from "@react-navigation/native";

// Seed data for new shows (2025-2026)
const NEW_SHOWS_SEED: MediaItem[] = [
  { id: "tt1312171", title: "The Umbrella Academy", rating: 8.0 },
  { id: "tt9253284", title: "The Witcher", rating: 8.0 },
  { id: "tt10293938", title: "The Bear", rating: 8.6 },
  { id: "tt9157530", title: "Stranger Things", rating: 8.7 },
];

// Seed data for new movies (2025-2026)
const NEW_MOVIES_SEED: MediaItem[] = [
  { id: "tt10872600", title: "Avengers: Doomsday", rating: 8.0 },
  { id: "tt9362722", title: "Blade", rating: 8.0 },
  { id: "tt5433140", title: "Thunderbolts*", rating: 8.1 },
  { id: "tt27345849", title: "Superman: Legacy", rating: 8.2 },
];

export default function Index() {
  const colorScheme = useColorScheme() || "dark";
  const colours = AppColours[colorScheme];
  const [continueWatching, setContinueWatching] = useState<MediaItem[]>([]);
  const [newShows, setNewShows] = useState<MediaItem[]>(NEW_SHOWS_SEED);
  const [newMovies, setNewMovies] = useState<MediaItem[]>(NEW_MOVIES_SEED);

  const loadCurrentlyWatching = useCallback(async () => {
    const items = await getCurrentlyWatching();
    setContinueWatching(items);
  }, []);

  // Filter to show only unrated items in Currently Watching
  const unratedWatching = useMemo(() => {
    return continueWatching.filter((item) => !item.rating || item.rating === 0);
  }, [continueWatching]);

  useFocusEffect(
    useCallback(() => {
      loadCurrentlyWatching();
    }, [loadCurrentlyWatching]),
  );

  useEffect(() => {
    let isMounted = true;

    const hydratePosters = async () => {
      const [showPosters, moviePosters] = await Promise.all([
        hydrateMediaItemsWithPosters(NEW_SHOWS_SEED),
        hydrateMediaItemsWithPosters(NEW_MOVIES_SEED),
      ]);

      if (!isMounted) return;
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

      {/* Currently Watching Section */}
      <Shelf
        title="Currently Watching"
        data={unratedWatching}
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
