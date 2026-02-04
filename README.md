# Bo-Myeon 🎬

A React Native mobile app for rating whatever you watch.

## Features

- **Media Search**: Search for movies and TV shows using the OMDB API
- **Search Results**: Browse posters with the ability to add items to your currently watching list
- **Currently Watching**: Persist and manage a local watchlist of media you're tracking
- **Poster Caching**: Efficient poster caching with support for reduced data mode
- **User Profiles**: Personalise your profile with name, description, and ratings
- **Settings**: Manage data and cache preferences
- **Cross-Platform**: Works on iOS, Android, and web

## Tech Stack

- **Framework**: React Native with Expo (v54)
- **Navigation**: Expo Router (file-based routing) + React Navigation
- **UI Components**: React Navigation with bottom tabs
- **Styling**: React Native with Expo Vector Icons
- **Language**: TypeScript 5.9
- **API Integration**: OMDB (Open Movie Database)
- **State & Storage**: AsyncStorage for local persistence
- **Animations**: React Native Reanimated, React Native Gesture Handler

## Prerequisites

- Node.js and npm installed
- Expo CLI (optional but recommended)
- OMDB API key (get one at [omdbapi.com](https://www.omdbapi.com))

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` or `.env.local` file in the root directory and add your OMDB API key:

   ```
   EXPO_PUBLIC_OMDB_API_KEY=your_api_key_here
   ```

3. **Start the app**

   ```bash
   npm start
   ```

   In the output, you'll find options to open the app in:
   - [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [Expo Go](https://expo.dev/go)
   - Web browser

## Available Scripts

- `npm start` - Start the development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

## Project Structure

```
bo-myeon/
├── app/                    # Main app directory (Expo Router)
│   ├── (tabs)/            # Tab-based screens
│   │   ├── _layout.tsx    # Tabs layout
│   │   ├── index.tsx      # Home/Browse media
│   │   ├── search.tsx     # Search media
│   │   └── profile.tsx    # User profile
│   ├── _layout.tsx        # Root stack layout
│   └── settings.tsx       # Settings screen
├── components/            # Reusable UI components
│   ├── PosterCard.tsx     # Media poster display
│   └── Shelf.tsx          # Shelf component for displaying media collections
├── config/                # API configuration
│   └── api.ts             # OMDB API helpers
├── constants/             # Theme and app constants
├── utils/                 # Storage and utility helpers
│   ├── currentlyWatchingStorage.ts  # Watchlist persistence
│   ├── omdbPosterCache.ts           # Poster caching logic
│   └── settingsStorage.ts           # Settings persistence
├── types/                 # TypeScript type definitions
│   └── media.ts           # Media-related types
├── assets/                # Images and icons
├── app.config.js          # Expo configuration
└── tsconfig.json          # TypeScript configuration
```

## Development

This project uses Expo's managed workflow with modern tooling:

- **File-based routing** with Expo Router for intuitive navigation
- **TypeScript** for type safety
- **ESLint** with Expo config for code quality
- **Bottom tab navigation** for easy access to main features
- **React Compiler** enabled for performance optimization
- **New Architecture** support enabled

## Learn More

For more information about the technologies used:

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [OMDB API Documentation](https://www.omdbapi.com/)
- [Expo Symbols](https://docs.expo.dev/guides/symbols/)

## Contributing

This is an early-stage side project—there's no guarantee that everything will work or that it will make it to the app store. Feel free to create issues and PRs!

## License

Currently unlicensed.
