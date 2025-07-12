// Global test setup
import '@testing-library/jest-dom';

// Mock window methods that might not be available in jsdom
global.window = {
  ...global.window,
  setTimeout: (callback, delay) => {
    callback();
    return 123;
  },
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
};

// Mock navigator.clipboard if not available
if (!global.navigator) {
  global.navigator = {};
}

if (!global.navigator.clipboard) {
  global.navigator.clipboard = {
    writeText: () => Promise.resolve(),
    readText: () => Promise.resolve('test clipboard text'),
  };
}

// Mock document if not available
if (!global.document) {
  global.document = {
    getElementById: () => null,
    querySelector: () => null,
    addEventListener: () => {},
  };
}
