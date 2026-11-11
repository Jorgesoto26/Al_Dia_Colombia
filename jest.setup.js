/* eslint-disable no-undef */
// Jest Setup for React Native & Al Día Colombia

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
      return Promise.resolve(null);
    }),
    getItem: jest.fn(key => {
      return Promise.resolve(store[key] || null);
    }),
    removeItem: jest.fn(key => {
      delete store[key];
      return Promise.resolve(null);
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
      return Promise.resolve(null);
    }),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  };
});

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const RealComponent = jest.requireActual('react-native');
  return {
    ...RealComponent,
    enableScreens: jest.fn(),
    ScreenContainer: RealComponent.View,
    Screen: RealComponent.View,
    NativeScreen: RealComponent.View,
    NativeScreenContainer: RealComponent.View,
  };
});

if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = class WebSocket {};
}

// Polyfill Headers for Node Jest environment
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init) {
      this._headers = {};
      if (init) {
        Object.entries(init).forEach(([k, v]) => {
          this._headers[k.toLowerCase()] = v;
        });
      }
    }
    get(name) {
      return this._headers[name.toLowerCase()] || null;
    }
    set(name, value) {
      this._headers[name.toLowerCase()] = String(value);
    }
  };
}

// Mock react-native-url-polyfill
jest.mock('react-native-url-polyfill/auto', () => {});

// Mock react-native-google-mobile-ads
jest.mock('react-native-google-mobile-ads', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: jest.fn(() => ({
      initialize: jest.fn(() => Promise.resolve([])),
      setRequestConfiguration: jest.fn(() => Promise.resolve()),
    })),
    BannerAd: props => React.createElement(View, props),
    BannerAdSize: {
      ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
      BANNER: 'BANNER',
    },
    TestIds: {
      ADAPTIVE_BANNER: 'ca-app-pub-3940256099942544/6300978111',
      BANNER: 'ca-app-pub-3940256099942544/6300978111',
    },
  };
});
