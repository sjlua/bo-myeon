import Constants from 'expo-constants';

// Type-safe access to environment variables
interface ApiConfig {
  omdbApiKey: string;
}

// Get config from expo constants
const getConfig = (): ApiConfig => {
  const omdbApiKey = Constants.expoConfig?.extra?.omdbApiKey;

  if (!omdbApiKey) {
    console.warn(
      'OMDb API key is not configured. Please set EXPO_PUBLIC_OMDB_API_KEY in your .env.local file.',
    );
  }

  return {
    omdbApiKey: omdbApiKey || '',
  };
};

export const config = getConfig();

// Helper function to check if API is properly configured
export const isApiConfigured = (): boolean => {
  return !!config.omdbApiKey;
};

// Export individual API keys for convenience
export const OMDB_API_KEY = config.omdbApiKey;
