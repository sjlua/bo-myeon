import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { AppColours } from "@/constants/colours";
import { ShelfProps, MediaItem } from "@/types/media";
import PosterCard from "./PosterCard";

export default function Shelf({
  title,
  data,
  showViewAll = false,
  viewAllText = "View All",
  onViewAllPress,
  onItemPress,
}: ShelfProps) {
  const colorScheme = useColorScheme() || "dark";
  const colours = AppColours[colorScheme];

  const styles = StyleSheet.create({
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
      alignItems: "center",
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: "600",
      color: colours.navBarButtonFocused,
    },
    contentContainerStyle: {
      paddingHorizontal: 20,
    },
  });

  const renderItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity
      onPress={() => onItemPress?.(item)}
      activeOpacity={onItemPress ? 0.7 : 1}
    >
      <PosterCard item={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        scrollEnabled
      />
      {showViewAll && (
        <View style={styles.sectionViewAll}>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={onViewAllPress}
          >
            <Text style={styles.viewAllText}>{viewAllText}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
