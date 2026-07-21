module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo already injects react-native-worklets/plugin when installed.
    // Do NOT also add react-native-reanimated/plugin — double workletization crashes Expo Go (SIGSEGV in libworklets.so).
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
  };
};
