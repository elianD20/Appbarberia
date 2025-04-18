module.exports = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      'module:metro-react-native-babel-preset', // Esto es específico para React Native
    ], plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
    };