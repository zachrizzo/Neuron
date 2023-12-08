module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel", // Other plugins come first
      "react-native-reanimated/plugin", // Reanimated plugin should be last
    ],
  };
};
