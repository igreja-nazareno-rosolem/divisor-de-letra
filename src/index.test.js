import { jest } from "@jest/globals";

describe("Main Application Functions", () => {
  describe("doAlmostEverything", () => {
    test("should be a function that can be called", async () => {
      // Mock DOM elements needed by the functions
      const mockTextArea = { value: 'Test\n\nLine 1\nLine 2' };
      const mockCheckbox = { checked: false };
      const mockWriteText = jest.fn(() => Promise.resolve());
      const mockQuerySelector = jest.fn(() => ({ classList: { add: jest.fn(), remove: jest.fn() } }));

      const originalGetElementById = global.document.getElementById;
      const originalClipboard = global.navigator.clipboard;
      const originalQuerySelector = global.document.querySelector;

      Object.defineProperty(global.document, 'getElementById', {
        value: jest.fn((id) => {
          if (id === "inputTextArea") return mockTextArea;
          if (id === "checkbox-parentheses") return mockCheckbox;
          if (id === "checkbox-lyrics-info") return mockCheckbox;
          return null;
        }),
        writable: true,
        configurable: true
      });

      Object.defineProperty(global.navigator, 'clipboard', {
        value: { writeText: mockWriteText, readText: jest.fn() },
        writable: true,
        configurable: true
      });

      Object.defineProperty(global.document, 'querySelector', {
        value: mockQuerySelector,
        writable: true,
        configurable: true
      });

      const { doAlmostEverything } = await import("./index.js");

      // Should not throw error when called
      expect(() => doAlmostEverything()).not.toThrow();

      // Should call clipboard writeText (from copyOutputText)
      expect(mockWriteText).toHaveBeenCalled();

      // Should clear the textarea (from clearLyrics)
      expect(mockTextArea.value).toBe('');

      // Restore original methods
      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
      Object.defineProperty(global.navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true
      });
      Object.defineProperty(global.document, 'querySelector', {
        value: originalQuerySelector,
        writable: true,
        configurable: true
      });
    });
  });

  describe("DOM Event Listeners", () => {
    test("should set up event listeners when module is imported", async () => {
      jest.resetModules();

      // Mock DOM elements
      const mockDivideButton = {
        addEventListener: jest.fn(),
      };

      const mockAddEventListener = jest.fn();

      // Store original methods
      const originalGetElementById = global.document.getElementById;
      const originalAddEventListener = global.document.addEventListener;

      // Mock document methods
      Object.defineProperty(global.document, 'getElementById', {
        value: jest.fn((id) => {
          if (id === "divideButton") return mockDivideButton;
          return null;
        }),
        writable: true,
        configurable: true
      });

      Object.defineProperty(global.document, 'addEventListener', {
        value: mockAddEventListener,
        writable: true,
        configurable: true
      });

      // Import the module (this will execute the event listener setup)
      await import("./index.js");

      // Check that DOMContentLoaded listener was added
      expect(mockAddEventListener).toHaveBeenCalledWith(
        "DOMContentLoaded",
        expect.any(Function)
      );

      // Simulate DOMContentLoaded event
      const domLoadedCallback = mockAddEventListener.mock.calls[0][1];
      domLoadedCallback();

      // Check that button event listener was added
      expect(global.document.getElementById).toHaveBeenCalledWith("divideButton");
      expect(mockDivideButton.addEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );

      // Restore original methods
      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
      Object.defineProperty(global.document, 'addEventListener', {
        value: originalAddEventListener,
        writable: true,
        configurable: true
      });
    });

    test("should handle missing divideButton gracefully", async () => {
      jest.resetModules();

      // Store original methods
      const originalGetElementById = global.document.getElementById;
      const originalAddEventListener = global.document.addEventListener;

      // Mock document with no button
      Object.defineProperty(global.document, 'getElementById', {
        value: jest.fn(() => null),
        writable: true,
        configurable: true
      });

      Object.defineProperty(global.document, 'addEventListener', {
        value: jest.fn(),
        writable: true,
        configurable: true
      });

      // Should not throw error when importing
      await expect(import("./index.js")).resolves.toBeDefined();

      // Restore original methods
      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
      Object.defineProperty(global.document, 'addEventListener', {
        value: originalAddEventListener,
        writable: true,
        configurable: true
      });
    });
  });
});
