import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
  Alert,
  Modal,
} from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppColours } from "@/constants/colours";
import { Link } from "expo-router";
import { MediaItem } from "@/types/media";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PosterCard from "@/components/PosterCard";
import { hydrateMediaItemsWithPosters } from "@/utils/omdbPosterCache";
import {
  getCurrentlyWatching,
  removeFromCurrentlyWatching,
  setCurrentlyWatching as setCurrentlyWatchingStorage,
  updateCurrentlyWatchingRating,
} from "@/utils/currentlyWatchingStorage";
import { useFocusEffect } from "@react-navigation/native";

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
      paddingTop: 20,
      paddingBottom: 24,
      paddingHorizontal: 20,
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
    descriptionInput: {
      fontSize: 14,
      color: colours.body,
      paddingVertical: 12,
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
    bodyText: {
      fontSize: 14,
      color: colours.body,
      paddingHorizontal: 20,
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
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    modalCard: {
      width: "100%",
      backgroundColor: colours.navBarBackground,
      borderRadius: 16,
      padding: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colours.heading,
      marginBottom: 6,
    },
    modalSubtitle: {
      fontSize: 13,
      color: colours.description,
      marginBottom: 12,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: colours.buttonBgColours,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: colours.heading,
      backgroundColor: colours.background,
    },
    modalError: {
      marginTop: 8,
      fontSize: 12,
      color: "#FF3B30",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 16,
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    modalButtonSecondary: {
      backgroundColor: colours.buttonBgColours,
    },
    modalButtonPrimary: {
      backgroundColor: colours.navBarButtonFocused,
    },
    modalButtonSecondaryText: {
      color: colours.heading,
      fontWeight: "600",
    },
    modalButtonPrimaryText: {
      color: colours.navBarBackground,
      fontWeight: "700",
    },
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [name, setName] = useState("Your Name");
  const [description, setDescription] = useState(
    "Add a description about yourself...",
  );

  const [currentlyWatching, setCurrentlyWatchingItems] = useState<MediaItem[]>(
    [],
  );
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingValue, setRatingValue] = useState("");
  const [ratingTarget, setRatingTarget] = useState<MediaItem | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);

  // Calculate average rating based on items in the Currently Watching list
  const averageRating = useMemo(() => {
    if (!Array.isArray(currentlyWatching) || currentlyWatching.length === 0) {
      return null;
    }
    const ratedItems = currentlyWatching.filter(
      (item) => typeof item.rating === "number",
    );
    if (ratedItems.length === 0) return null;
    const total = ratedItems.reduce(
      (sum, item) => sum + (item.rating as number),
      0,
    );
    return Math.round((total / ratedItems.length) * 10) / 10;
  }, [currentlyWatching]);

  // Get top shows - filtered and sorted from currently watching
  const topWatched = useMemo(() => {
    return currentlyWatching
      .filter((item) => typeof item.rating === "number" && item.rating > 0)
      .sort((a, b) => (b.rating as number) - (a.rating as number));
  }, [currentlyWatching]);

  // Get unrated items - items without a rating or rating = 0
  const unratedItems = useMemo(() => {
    return currentlyWatching.filter(
      (item) => !item.rating || item.rating === 0,
    );
  }, [currentlyWatching]);

  // Get completed items - items with a rating
  const completedItems = useMemo(() => {
    return currentlyWatching.filter(
      (item) => typeof item.rating === "number" && item.rating > 0,
    );
  }, [currentlyWatching]);

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

  const loadCurrentlyWatching = useCallback(async () => {
    const items = await getCurrentlyWatching();
    setCurrentlyWatchingItems(items);
  }, []);

  const handleOpenRating = (item: MediaItem) => {
    setRatingTarget(item);
    setRatingValue(
      item.rating !== undefined && item.rating !== null
        ? String(item.rating)
        : "",
    );
    setRatingError(null);
    setRatingModalVisible(true);
  };

  const handleSaveRating = async () => {
    if (!ratingTarget) return;
    const parsed = Number.parseFloat(ratingValue);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 10) {
      setRatingError("Enter a rating between 0 and 10.");
      return;
    }

    const updated = await updateCurrentlyWatchingRating(
      ratingTarget.id,
      parsed,
    );
    setCurrentlyWatchingItems(updated);
    setRatingModalVisible(false);
  };

  const handleRemoveItem = async (item: MediaItem) => {
    const updated = await removeFromCurrentlyWatching(item.id);
    setCurrentlyWatchingItems(updated);
  };

  const moveCurrentlyWatchingItem = async (
    fromIndex: number,
    toIndex: number,
  ) => {
    if (toIndex < 0 || toIndex >= currentlyWatching.length) return;
    const next = [...currentlyWatching];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    await setCurrentlyWatchingStorage(next);
    setCurrentlyWatchingItems(next);
  };

  const handlePressItem = (item: MediaItem) => {
    Alert.alert(item.title, "Choose an option", [
      { text: "Rate it!", onPress: () => handleOpenRating(item) },
      {
        text: "Remove it",
        style: "destructive",
        onPress: () => handleRemoveItem(item),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Handle long press to reorder items
  // This will show options to move the item left/right or to start/end
  const handleLongPressItem = (item: MediaItem, index: number) => {
    const options: {
      text: string;
      onPress?: () => void;
      style?: "default" | "cancel" | "destructive";
    }[] = [];

    if (index > 0) {
      options.push({
        text: "Move Left",
        onPress: () => moveCurrentlyWatchingItem(index, index - 1),
      });
      options.push({
        text: "Move to Start",
        onPress: () => moveCurrentlyWatchingItem(index, 0),
      });
    }

    if (index < currentlyWatching.length - 1) {
      options.push({
        text: "Move Right",
        onPress: () => moveCurrentlyWatchingItem(index, index + 1),
      });
      options.push({
        text: "Move to End",
        onPress: () =>
          moveCurrentlyWatchingItem(index, currentlyWatching.length - 1),
      });
    }

    options.push({ text: "Cancel", style: "cancel" });

    Alert.alert(item.title, "Reorder item", options);
  };

  useFocusEffect(
    useCallback(() => {
      loadCurrentlyWatching();
      return () => undefined;
    }, [loadCurrentlyWatching]),
  );

  useEffect(() => {
    loadCurrentlyWatching();
  }, [loadCurrentlyWatching]);

  useFocusEffect(
    useCallback(() => {
      loadCurrentlyWatching();
    }, [loadCurrentlyWatching]),
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
          <Text style={styles.averageRatingValue}>
            {averageRating !== null ? averageRating : "No ratings yet!"}
          </Text>
        </View>
      </View>

      {/* Currently Watching Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Currently Watching</Text>
        {unratedItems.length === 0 ? (
          <Text style={styles.bodyText}>
            Add shows or movies from Search to see them here.
          </Text>
        ) : (
          <FlatList
            data={unratedItems}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePressItem(item)}
                onLongPress={() => handleLongPressItem(item, index)}
              >
                <PosterCard item={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            scrollEnabled
          />
        )}
      </View>

      {/* Top Watched Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Top Watched</Text>
        <FlatList
          data={topWatched}
          renderItem={({ item }) => <PosterCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          scrollEnabled
        />
      </View>

      {/* Completed Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Completed</Text>
        {completedItems.length === 0 ? (
          <Text style={styles.bodyText}>No completed shows or movies yet.</Text>
        ) : (
          <FlatList
            data={completedItems}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePressItem(item)}
                onLongPress={() => handleLongPressItem(item, index)}
              >
                <PosterCard item={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            scrollEnabled
          />
        )}
      </View>

      <View style={styles.settingsContainer}>
        <Link href="/settings">
          <Text style={styles.settingsLink}>Settings</Text>
        </Link>
      </View>

      <Modal
        transparent
        visible={ratingModalVisible}
        animationType="fade"
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rate it</Text>
            <Text style={styles.modalSubtitle}>
              Enter a rating from 0 to 10.
            </Text>
            <TextInput
              style={styles.modalInput}
              value={ratingValue}
              onChangeText={(value) => {
                setRatingValue(value);
                setRatingError(null);
              }}
              placeholder="e.g., 8.5"
              placeholderTextColor={colours.description}
              keyboardType="decimal-pad"
            />
            {ratingError && (
              <Text style={styles.modalError}>{ratingError}</Text>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setRatingModalVisible(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveRating}
              >
                <Text style={styles.modalButtonPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
