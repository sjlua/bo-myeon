import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppColours } from "@/constants/colours";
import { Link } from "expo-router";
import { MediaItem } from "@/types/media";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PosterCard from "@/components/PosterCard";
import { hydrateMediaItemsWithPosters } from "@/utils/omdbPosterCache";

// Seed data for top shows and films
const TOP_SHOWS_SEED: MediaItem[] = [
  { id: "tt0903747", title: "Breaking Bad", rating: 9.5 },
  { id: "tt7366338", title: "Chernobyl", rating: 9.3 },
  { id: "tt7660850", title: "Succession", rating: 9.1 },
  { id: "tt3581920", title: "The Last of Us", rating: 8.9 },
  { id: "tt0944947", title: "Game of Thrones", rating: 8.7 },
];

const TOP_FILMS_SEED: MediaItem[] = [
  { id: "tt1375666", title: "Inception", rating: 8.8 },
  { id: "tt0111161", title: "The Shawshank Redemption", rating: 9.3 },
  { id: "tt6751668", title: "Parasite", rating: 8.6 },
  { id: "tt15398776", title: "Oppenheimer", rating: 8.4 },
  { id: "tt15239678", title: "Dune: Part Two", rating: 8.5 },
];

export default function Profile() {
  const colorScheme = useColorScheme() || "dark";
  const colours = AppColours[colorScheme];

  const saveMediaItems = async (mediaArr: MediaItem[]) => {
    try {
      const jsonMedia = JSON.stringify(mediaArr);
      await AsyncStorage.setItem("mediaItems", jsonMedia);
    } catch (error) {
      console.error("Error saving media items to device:", error);
    }
  };

  const loadMediaItems = async (): Promise<MediaItem[]> => {
    try {
      const jsonMedia = await AsyncStorage.getItem("mediaItems");
      return jsonMedia ? JSON.parse(jsonMedia) : [];
    } catch (error) {
      console.error("Error loading media items from device:", error);
      return [];
    }
  };

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
    nameContainer: {
      marginBottom: 16,
    },
    nameEditingView: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    nameInput: {
      flex: 1,
      fontSize: 28,
      fontWeight: "700",
      color: colours.heading,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colours.background,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colours.navBarButtonFocused,
    },
    nameCheckButton: {
      padding: 8,
      backgroundColor: colours.buttonBgColours,
      borderRadius: 6,
    },
    nameDisplayView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    nameText: {
      fontSize: 28,
      fontWeight: "700",
      color: colours.heading,
    },
    descriptionContainer: {
      gap: 8,
    },
    descriptionInput: {
      fontSize: 14,
      color: colours.body,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: colours.background,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colours.navBarButtonFocused,
      minHeight: 80,
      textAlignVertical: "top",
    },
    descriptionCheckButton: {
      padding: 10,
      backgroundColor: colours.buttonBgColours,
      borderRadius: 6,
      alignSelf: "flex-start",
    },
    descriptionDisplayView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    descriptionText: {
      fontSize: 14,
      color: colours.description,
      flex: 1,
      lineHeight: 20,
    },
    descriptionEditButton: {
      marginLeft: 8,
    },
    averageRatingSection: {
      backgroundColor: colours.navBarBackground,
      marginHorizontal: 20,
      marginTop: 20,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    averageRatingLabel: {
      fontSize: 12,
      color: colours.description,
      marginBottom: 4,
    },
    averageRatingValue: {
      fontSize: 24,
      fontWeight: "700",
      color: colours.heading,
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
    contentContainerStyle: {
      paddingHorizontal: 20,
    },
    settingsLink: {
      fontSize: 16,
      fontWeight: "600",
      color: colours.navBarButtonFocused,
      textAlign: "center",
      padding: 12,
    },
    settingsContainer: {
      marginBottom: 20,
    },
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [name, setName] = useState("Your Name");
  const [description, setDescription] = useState(
    "Add a description about yourself...",
  );
  const [averageRating] = useState(8.7);
  const [topShows, setTopShows] = useState<MediaItem[]>(TOP_SHOWS_SEED);
  const [topFilms, setTopFilms] = useState<MediaItem[]>(TOP_FILMS_SEED);

  useEffect(() => {
    // Load name and description from AsyncStorage on component mount
    AsyncStorage.getItem("profileName").then((storedName) => {
      if (storedName) setName(storedName);
    });
    AsyncStorage.getItem("profileDescription").then((storedDescription) => {
      if (storedDescription) setDescription(storedDescription);
    });
  }, []);

  useEffect(() => {
    // Save name to AsyncStorage whenever it changes
    AsyncStorage.setItem("profileName", name);
  }, [name]);

  useEffect(() => {
    // Save description to AsyncStorage whenever it changes
    AsyncStorage.setItem("profileDescription", description);
  }, [description]);

  useEffect(() => {
    let isMounted = true;

    const hydratePosters = async () => {
      const [shows, films] = await Promise.all([
        hydrateMediaItemsWithPosters(TOP_SHOWS_SEED),
        hydrateMediaItemsWithPosters(TOP_FILMS_SEED),
      ]);

      if (!isMounted) return;
      setTopShows(shows);
      setTopFilms(films);
    };

    hydratePosters();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        {/* Name */}
        <View style={styles.nameContainer}>
          {isEditingName ? (
            <View style={styles.nameEditingView}>
              <TextInput
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colours.description}
              />
              <TouchableOpacity
                onPress={() => setIsEditingName(false)}
                style={styles.nameCheckButton}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameDisplayView}>
              <Text style={styles.nameText}>{name}</Text>
              <TouchableOpacity onPress={() => setIsEditingName(true)}>
                <Ionicons
                  name="pencil"
                  size={20}
                  color={colours.navBarButtonFocused}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Description */}
        <View>
          {isEditingDescription ? (
            <View style={styles.descriptionContainer}>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Add a description about yourself..."
                placeholderTextColor={colours.description}
                multiline
              />
              <TouchableOpacity
                onPress={() => setIsEditingDescription(false)}
                style={styles.descriptionCheckButton}
              >
                <Ionicons name="checkmark" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.descriptionDisplayView}>
                <Text style={styles.descriptionText}>{description}</Text>
                <TouchableOpacity
                  onPress={() => setIsEditingDescription(true)}
                  style={styles.descriptionEditButton}
                >
                  <Ionicons
                    name="pencil"
                    size={16}
                    color={colours.navBarButtonFocused}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Average Rating Section */}
      <View style={styles.averageRatingSection}>
        <Ionicons name="star" size={32} color={colours.ratingStars} />
        <View>
          <Text style={styles.averageRatingLabel}>Average Rating</Text>
          <Text style={styles.averageRatingValue}>{averageRating}</Text>
        </View>
      </View>

      {/* Top Shows Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Top Shows</Text>
        <FlatList
          data={topShows}
          renderItem={({ item }) => <PosterCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          scrollEnabled
        />
      </View>

      {/* Top Films Section */}
      <View style={[styles.sectionContainer, { marginBottom: 20 }]}>
        <Text style={styles.sectionTitle}>Top Films</Text>
        <FlatList
          data={topFilms}
          renderItem={({ item }) => <PosterCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          scrollEnabled
        />
      </View>

      <View style={styles.settingsContainer}>
        <Link href="/settings">
          <Text style={styles.settingsLink}>Settings</Text>
        </Link>
      </View>
    </ScrollView>
  );
}
