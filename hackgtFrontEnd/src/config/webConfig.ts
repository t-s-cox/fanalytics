import { Platform } from 'react-native';

// Web-specific configurations for better mobile web experience
export const webConfig = {
  // Disable certain mobile behaviors that don't work well on web
  isWeb: Platform.OS === 'web',
  
  // ScrollView configurations for web
  scrollViewProps: Platform.OS === 'web' ? {
    style: { overflow: 'scroll' },
    contentContainerStyle: { minHeight: '100%' }
  } : {},
  
  // Add web-specific styles when needed
  webStyles: Platform.OS === 'web' ? {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
  } : {},
};

// Helper function to add web-specific props
export const addWebProps = (baseProps: any) => {
  if (Platform.OS === 'web') {
    return {
      ...baseProps,
      // Enable smooth scrolling on web
      style: {
        ...baseProps.style,
        WebkitOverflowScrolling: 'touch',
        overflow: 'auto'
      }
    };
  }
  return baseProps;
};