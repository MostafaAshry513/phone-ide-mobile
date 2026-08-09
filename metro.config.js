// Metro config for Phone IDE — Expo SDK 57
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

// Fix: expo-modules-core ships .ts source — ensure Metro handles it
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'mjs',
];

// Exclude test files from bundle
config.resolver.blockList = [
  /\/tests\/.*/,
  /\/__tests__\/.*/,
];

module.exports = config;
