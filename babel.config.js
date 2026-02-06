module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // MUST be last — required for reanimated + drawer
    'react-native-reanimated/plugin',
  ],
};