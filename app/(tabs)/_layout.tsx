import { Platform, useColorScheme } from "react-native";
import { AppColours } from "../../constants/colours";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
  // Get the colour scheme from app.json userInterfaceStyle, null fallback is light
  const colourScheme = useColorScheme() ?? "light";
  const theme = AppColours[colourScheme];

  // Check if iOS 26 for native tab bar
  const isNativeTabsSupported =
    Platform.OS === "ios" && Number(Platform.Version) >= 26;

  if (isNativeTabsSupported) {
    // Native tab bar
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Label>Home</Label>
          <Icon sf="tv" drawable="tv" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="search">
          <Label>Search</Label>
          <Icon sf="magnifyingglass" drawable="search" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Label>Profile</Label>
          <Icon sf="person.circle" drawable="person_circle" />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  } else {
    // Standard tab bar for other platforms
    return (
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBarBackground },
          headerTintColor: theme.heading,
          tabBarActiveTintColor: theme.navBarButtonFocused,
        }}
      >
        {/* Home tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="tv" size={size} color={color} />
            ),
          }}
        />

        {/* Search tab */}
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    );
  }
}
