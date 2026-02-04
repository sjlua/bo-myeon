// Colour constants for dark and light modes following Apple's Human Interface Guidelines
// Reference: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/
export const AppColours = {
  dark: {
    // Primary accent - using Apple's blue for better contrast and accessibility
    heroAccent: "#0A84FFFF", // Apple system blue

    // Text colors with proper WCAG AA contrast ratios
    heading: "#FFFFFFFF", // Pure white for maximum contrast on dark backgrounds
    description: "#EBEBF5FF", // Secondary label - Apple's standard for dark mode
    rating: "#EBEBF5FF", // Tertiary text
    body: "#EBEBF5FF", // Secondary label equivalent

    // Background colors following Apple's dark mode palette
    background: "#000000FF", // True black for OLED optimization
    navBarBackground: "#1C1C1EFF", // Apple's dark gray

    // Button and interactive elements
    navBarButtonFocused: "#0A84FFFF", // Apple system blue for focus state
    buttonBgColours: "#0A84FFFF", // Apple system blue
    buttonText: "#FFFFFFFF", // White text on blue button

    // Icon and accent colors
    iconColours: "#EBEBF5FF", // Secondary label color
    ratingStars: "#FFB808FF", // Apple's yellow/gold for ratings
  },

  light: {
    // Primary accent - using Apple's blue
    heroAccent: "#0A84FFFF", // Apple system blue

    // Text colors with proper WCAG AA contrast ratios
    heading: "#000000FF", // Pure black for maximum contrast on light backgrounds
    description: "#3C3C4399", // Tertiary label - Apple's standard for light mode
    rating: "#3C3C4399", // Tertiary text
    body: "#3C3C4399", // Tertiary label equivalent

    // Background colors following Apple's light mode palette
    background: "#FFFFFFFF", // White background
    navBarBackground: "#F2F2F7FF", // Apple's light gray

    // Button and interactive elements
    navBarButtonFocused: "#0A84FFFF", // Apple system blue for focus state
    buttonBgColours: "#0A84FFFF", // Apple system blue
    buttonText: "#FFFFFFFF", // White text on blue button

    // Icon and accent colors
    iconColours: "#3C3C4399", // Tertiary label color
    ratingStars: "#FFB808FF", // Apple's yellow/gold for ratings
  },
};
