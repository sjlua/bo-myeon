# Bo-Myeon 🎬

A React Native mobile app for rating whatever you watch.

## Features

- **Movie Search**: Search for movies using the OMDB API
- **Movie Details**: View comprehensive information about movies
- **User Profiles**: Manage your movie profile and preferences
- **Settings**: Customize app behavior and preferences
- **Cross-Platform**: Works on iOS, Android, and web

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: React Navigation with bottom tabs
- **Styling**: React Native with vector icons
- **Language**: TypeScript
- **API**: OMDB (Open Movie Database)
- **Additional**: React Native Reanimated, React Native Gesture Handler

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

   Create a `.env` file in the root directory and add your OMDB API key:

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
├── app/                 # Main app directory (Expo Router)
│   ├── (tabs)/         # Tab-based screens
│   │   ├── index.tsx   # Home/Browse media
│   │   ├── search.tsx  # Search media
│   │   └── profile.tsx # User profile
│   ├── _layout.tsx     # Root layout
│   └── settings.tsx    # Settings screen
├── components/         # Reusable React components
├── constants/          # App constants
├── types/              # TypeScript type definitions
├── assets/             # Images and icons
└── config/             # Configuration files
```

## Development

This project uses Expo's managed workflow and includes:

- **File-based routing** with Expo Router for intuitive navigation
- **TypeScript** for type safety
- **ESLint** for code quality
- **Bottom tab navigation** for easy access to main screens

## Learn More

For more information about the technologies used:

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [OMDB API Documentation](https://www.omdbapi.com/)

## Contributing

This is a super early side project of mine, there is no guarantee that anything will work, or that it will make it to the app store. Feel free to create issues/PRs though.