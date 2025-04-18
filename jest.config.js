module.exports = {
    preset: 'react-native',
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "/node_modules/(?!(@react-native|firebase)/)",
      ],
  };
