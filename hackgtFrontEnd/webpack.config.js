const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    // Customize the webpack config here
    offline: false, // Service worker
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        // Add packages that need to be transpiled
      ]
    }
  }, argv);
  
  // Customize for mobile-friendly web app
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  return config;
};