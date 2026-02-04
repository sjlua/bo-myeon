import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { MediaItem } from "@/types/media";
import { AppColours } from "@/constants/colours";

interface PosterCardProps {
  item: MediaItem;
}

export default function PosterCard({ item }: PosterCardProps) {
  const colorScheme = useColorScheme() || "dark";
  const colours = AppColours[colorScheme];

  const styles = StyleSheet.create({
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
    posterFallback: {
      width: "100%",
      height: "100%",
      backgroundColor: colours.buttonBgColours,
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
  });

  return (
    <View style={styles.posterCard}>
      <View style={styles.posterImage}>
        {item.poster && item.poster !== "N/A" ? (
          <Image
            source={{ uri: item.poster }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={styles.posterFallback} />
        )}
      </View>
      <Text style={styles.posterTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.posterRating}>
        <Ionicons name="star" size={14} color={colours.ratingStars} />
        <Text style={styles.ratingText}>
          {item.rating !== undefined ? item.rating : "In progress."}
        </Text>
      </View>
    </View>
  );
}
