import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppColours } from "@/constants/colours";
import { Link } from "expo-router";
import { MediaItem } from "@/types/media";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Placeholder data for top shows and films
const PLACEHOLDER_SHOWS: MediaItem[] = [
  { id: "1", title: "Breaking Bad", rating: 9.5, poster: "📺" },
  { id: "2", title: "Chernobyl", rating: 9.3, poster: "📺" },
  { id: "3", title: "Succession", rating: 9.1, poster: "📺" },
  { id: "4", title: "The Last of Us", rating: 8.9, poster: "📺" },
  { id: "5", title: "Game of Thrones", rating: 8.7, poster: "📺" },
];

const PLACEHOLDER_FILMS: MediaItem[] = [
  { id: "1", title: "Inception", rating: 8.8, poster: "🎬" },
  { id: "2", title: "The Shawshank Redemption", rating: 9.3, poster: "🎬" },
  { id: "3", title: "Parasite", rating: 8.6, poster: "🎬" },
  { id: "4", title: "Oppenheimer", rating: 8.4, poster: "🎬" },
  { id: "5", title: "Dune: Part Two", rating: 8.5, poster: "🎬" },
];

export default function Profile() {
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

  const PosterCard = ({ item }: { item: MediaItem }) => (
    <View style={styles.posterCard}>
      <View style={styles.posterImage}>
        <Text style={styles.posterEmoji}>{item.poster}</Text>
      </View>
      <Text style={styles.posterTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.posterRating}>
        <Ionicons name="star" size={14} color={colours.ratingStars} />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
    </View>
  );

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
          data={PLACEHOLDER_SHOWS}
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
          data={PLACEHOLDER_FILMS}
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
