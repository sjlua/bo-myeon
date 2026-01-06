import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { AppColours } from "../constants/colours";

export default function RootLayout() {
  // Get the colour scheme from app.json userInterfaceStyle, null fallback is light
  const colourScheme = useColorScheme() ?? "light";
  const colours = AppColours[colourScheme];

  return (
    <Stack>
      {/* Tabs navigator */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }} // otherwise there'll be a (tabs) header
      />

      {/* Settings page */}
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerBackTitle: "Profile",
          headerStyle: { backgroundColor: colours.navBarBackground },
          headerTintColor: colours.heading,
        }}
      />
    </Stack>
  );
}
