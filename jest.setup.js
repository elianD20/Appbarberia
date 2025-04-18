import '@testing-library/jest-native/extend-expect';

// Mock para Linking
jest.mock('react-native', () => {
    const originalModule = jest.requireActual('react-native');
    return {
      ...originalModule,
      Linking: {
        openURL: jest.fn(),
      },
    };
  });
  
  // Mock para MapView
  jest.mock('react-native-maps', () => {
    return {
      __esModule: true,
      default: 'MapView',
      Marker: 'Marker',
    };
  });