import { jest } from "@jest/globals";

describe("Notification Utility Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("showNotification", () => {
    test("should add notify class to notification element", async () => {
      jest.resetModules();
      
      const mockNotificationElement = {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
      };

      const mockQuerySelector = jest.fn(() => mockNotificationElement);
      const mockSetTimeout = jest.fn((callback, delay) => {
        return 123;
      });

      const originalQuerySelector = global.document.querySelector;
      const originalSetTimeout = global.setTimeout;

      Object.defineProperty(global.document, 'querySelector', {
        value: mockQuerySelector,
        writable: true,
        configurable: true
      });
      global.setTimeout = mockSetTimeout;

      const { showNotification } = await import("./notification.js");
      showNotification();
      
      expect(mockQuerySelector).toHaveBeenCalledWith('p.copy-success-message');
      expect(mockNotificationElement.classList.add).toHaveBeenCalledWith('notify');

      Object.defineProperty(global.document, 'querySelector', {
        value: originalQuerySelector,
        writable: true,
        configurable: true
      });
      global.setTimeout = originalSetTimeout;
    });

    test("should call setTimeout with correct parameters", async () => {
      jest.resetModules();
      
      const mockNotificationElement = {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
      };

      const mockQuerySelector = jest.fn(() => mockNotificationElement);
      const mockSetTimeout = jest.fn();

      const originalQuerySelector = global.document.querySelector;
      const originalSetTimeout = global.setTimeout;

      Object.defineProperty(global.document, 'querySelector', {
        value: mockQuerySelector,
        writable: true,
        configurable: true
      });
      global.setTimeout = mockSetTimeout;

      const { showNotification } = await import("./notification.js");
      showNotification();
      
      expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);

      Object.defineProperty(global.document, 'querySelector', {
        value: originalQuerySelector,
        writable: true,
        configurable: true
      });
      global.setTimeout = originalSetTimeout;
    });

    test("should remove notify class after timeout", async () => {
      jest.resetModules();
      
      const mockNotificationElement = {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
      };

      const mockQuerySelector = jest.fn(() => mockNotificationElement);
      const mockSetTimeout = jest.fn((callback, delay) => {
        // Immediately call the callback for testing
        callback();
        return 123;
      });

      const originalQuerySelector = global.document.querySelector;
      const originalSetTimeout = global.setTimeout;

      Object.defineProperty(global.document, 'querySelector', {
        value: mockQuerySelector,
        writable: true,
        configurable: true
      });
      global.setTimeout = mockSetTimeout;

      const { showNotification } = await import("./notification.js");
      showNotification();
      
      expect(mockNotificationElement.classList.remove).toHaveBeenCalledWith('notify');

      Object.defineProperty(global.document, 'querySelector', {
        value: originalQuerySelector,
        writable: true,
        configurable: true
      });
      global.setTimeout = originalSetTimeout;
    });

    test("should handle missing notification element gracefully", async () => {
      jest.resetModules();
      
      const mockQuerySelector = jest.fn(() => null);

      const originalQuerySelector = global.document.querySelector;
      Object.defineProperty(global.document, 'querySelector', {
        value: mockQuerySelector,
        writable: true,
        configurable: true
      });

      const { showNotification } = await import("./notification.js");
      
      // Should not throw error
      expect(() => showNotification()).not.toThrow();

      Object.defineProperty(global.document, 'querySelector', {
        value: originalQuerySelector,
        writable: true,
        configurable: true
      });
    });

    test("should handle notification element without classList", async () => {
      jest.resetModules();
      
      const mockQuerySelector = jest.fn(() => ({}));

      const originalQuerySelector = global.document.querySelector;
      Object.defineProperty(global.document, 'querySelector', {
        value: mockQuerySelector,
        writable: true,
        configurable: true
      });

      const { showNotification } = await import("./notification.js");
      
      // Should not throw error
      expect(() => showNotification()).not.toThrow();

      Object.defineProperty(global.document, 'querySelector', {
        value: originalQuerySelector,
        writable: true,
        configurable: true
      });
    });

    test("should handle notification element with missing methods", async () => {
      jest.resetModules();
      
      const mockQuerySelector = jest.fn(() => ({
        classList: {}
      }));

      const originalQuerySelector = global.document.querySelector;
      Object.defineProperty(global.document, 'querySelector', {
        value: mockQuerySelector,
        writable: true,
        configurable: true
      });

      const { showNotification } = await import("./notification.js");
      
      // Should not throw error
      expect(() => showNotification()).not.toThrow();

      Object.defineProperty(global.document, 'querySelector', {
        value: originalQuerySelector,
        writable: true,
        configurable: true
      });
    });
  });
});
