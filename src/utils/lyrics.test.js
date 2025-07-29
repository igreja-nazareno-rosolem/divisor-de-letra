import { jest } from "@jest/globals";

// Mock the notification module
const mockShowNotification = jest.fn();
jest.mock("./notification.js", () => ({
  showNotification: mockShowNotification,
}));

describe("Lyrics Utility Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTitle", () => {
    test("should join lines with \" - \" separator", async () => {
      const { getTitle } = await import("./lyrics.js");
      const input = "Line 1\nLine 2\nLine 3";
      const expected = "Line 1 - Line 2 - Line 3";
      expect(getTitle(input)).toBe(expected);
    });

    test("should handle single line", async () => {
      const { getTitle } = await import("./lyrics.js");
      const input = "Single Line";
      const expected = "Single Line";
      expect(getTitle(input)).toBe(expected);
    });

    test("should handle empty string", async () => {
      const { getTitle } = await import("./lyrics.js");
      const input = "";
      const expected = "";
      expect(getTitle(input)).toBe(expected);
    });

    test("should handle multiple newlines", async () => {
      const { getTitle } = await import("./lyrics.js");
      const input = "Line 1\n\nLine 2\n\n\nLine 3";
      const expected = "Line 1 -  - Line 2 -  -  - Line 3";
      expect(getTitle(input)).toBe(expected);
    });
  });

  describe("removeParentheses", () => {
    test("should remove content within parentheses", async () => {
      const { removeParentheses } = await import("./lyrics.js");
      const input = "Hello (world) there";
      const expected = "Hello  there";
      expect(removeParentheses(input)).toBe(expected);
    });

    test("should remove multiple parentheses", async () => {
      const { removeParentheses } = await import("./lyrics.js");
      const input = "Hello (world) and (universe) there";
      const expected = "Hello  and  there";
      expect(removeParentheses(input)).toBe(expected);
    });

    test("should handle nested parentheses", async () => {
      const { removeParentheses } = await import("./lyrics.js");
      const input = 'Hello (world (nested)) there';
      const expected = 'Hello  there';
      expect(removeParentheses(input)).toBe(expected);
    });

    test("should handle string without parentheses", async () => {
      const { removeParentheses } = await import("./lyrics.js");
      const input = "Hello world there";
      const expected = "Hello world there";
      expect(removeParentheses(input)).toBe(expected);
    });

    test("should handle empty string", async () => {
      const { removeParentheses } = await import("./lyrics.js");
      const input = "";
      const expected = "";
      expect(removeParentheses(input)).toBe(expected);
    });

    test("should handle only parentheses", async () => {
      const { removeParentheses } = await import("./lyrics.js");
      const input = "(content)";
      const expected = "";
      expect(removeParentheses(input)).toBe(expected);
    });
  });

  describe("addTitle", () => {
    test("should add title to the beginning of lyrics", async () => {
      const { addTitle } = await import("./lyrics.js");
      const lyrics = "Verse 1\nVerse 2";
      const title = "Song Title";
      const expected = "Song Title\n\nVerse 1\nVerse 2";
      expect(addTitle(title, lyrics)).toBe(expected);
    });

    test("should handle empty lyrics", async () => {
      const { addTitle } = await import("./lyrics.js");
      const lyrics = "";
      const title = "Song Title";
      const expected = "Song Title\n\n";
      expect(addTitle(title, lyrics)).toBe(expected);
    });

    test("should handle empty title", async () => {
      const { addTitle } = await import("./lyrics.js");
      const lyrics = "Verse 1\nVerse 2";
      const title = "";
      const expected = "Verse 1\nVerse 2";
      expect(addTitle(title, lyrics)).toBe(expected);
    });

    test("should handle both empty lyrics and title", async () => {
      const { addTitle } = await import("./lyrics.js");
      const lyrics = "";
      const title = "";
      const expected = "";
      expect(addTitle(title, lyrics)).toBe(expected);
    });
  })

  describe("divideLyrics", () => {
    test("should process lyrics and return formatted output", async () => {
      jest.resetModules();

      const mockTextArea = {
        value: 'Title\n\nVerse 1 line 1\nVerse 1 line 2\n\nVerse 2 line 1\nVerse 2 line 2',
      };
      const mockNotCheckedCheckbox = { checked: false };
      const mockCheckedCheckbox = { checked: true };

      const originalGetElementById = global.document.getElementById;
      Object.defineProperty(global.document, 'getElementById', {
        value: jest.fn((id) => {
          if (id === "inputTextArea") return mockTextArea;
          if (id === "checkbox-parentheses") return mockNotCheckedCheckbox;
          if (id === "checkbox-lyrics-info") return mockCheckedCheckbox;
          return null;
        }),
        writable: true,
        configurable: true
      });

      const { divideLyrics } = await import("./lyrics.js");
      const result = divideLyrics();

      expect(result).toContain('Title');
      expect(result).toContain('VERSE 1 LINE 1');
      expect(result).toContain('VERSE 1 LINE 2');
      expect(result).toContain('VERSE 2 LINE 1');
      expect(result).toContain('VERSE 2 LINE 2');

      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
    });

    test("should remove parentheses when checkbox is checked", async () => {
      jest.resetModules();

      const mockTextArea = {
        value: 'Title (chords)\n\nVerse 1 (C) line 1\nVerse 1 (G) line 2',
      };
      const mockCheckbox = { checked: true };

      const originalGetElementById = global.document.getElementById;
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

      const { divideLyrics } = await import("./lyrics.js");
      const result = divideLyrics();

      expect(result).toContain('Title');
      expect(result).not.toContain('(chords)');
      expect(result).not.toContain('(C)');
      expect(result).not.toContain('(G)');

      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
    });

    test("should handle empty input", async () => {
      jest.resetModules();

      const mockTextArea = { value: '' };
      const mockCheckbox = { checked: false };

      const originalGetElementById = global.document.getElementById;
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

      const { divideLyrics } = await import("./lyrics.js");
      const result = divideLyrics();

      expect(result).toContain('\n');

      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
    });

    test("should return empty string when elements are missing", async () => {
      jest.resetModules();

      const originalGetElementById = global.document.getElementById;
      Object.defineProperty(global.document, 'getElementById', {
        value: jest.fn(() => null),
        writable: true,
        configurable: true
      });

      const { divideLyrics } = await import("./lyrics.js");
      const result = divideLyrics();

      expect(result).toBe('');

      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
    });
  });

  describe("copyOutputText", () => {
    test("should call navigator.clipboard.writeText with provided text", async () => {
      const mockWriteText = jest.fn(() => Promise.resolve());
      const originalClipboard = global.navigator.clipboard;

      Object.defineProperty(global.navigator, 'clipboard', {
        value: {
          writeText: mockWriteText,
          readText: jest.fn(),
        },
        writable: true,
        configurable: true
      });

      const { copyOutputText } = await import("./lyrics.js");
      const testText = "Test output text";

      copyOutputText(testText);

      expect(mockWriteText).toHaveBeenCalledWith(testText);
      // Note: We can't easily test the showNotification call due to module mocking complexity
      // but the main functionality (clipboard write) is tested

      Object.defineProperty(global.navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true
      });
    });
  });

  describe("clearLyrics", () => {
    test("should clear the textarea value", async () => {
      jest.resetModules();

      const mockTextArea = { value: "Some text" };

      const originalGetElementById = global.document.getElementById;
      Object.defineProperty(global.document, 'getElementById', {
        value: jest.fn((id) => {
          if (id === "inputTextArea") return mockTextArea;
          return null;
        }),
        writable: true,
        configurable: true
      });

      const { clearLyrics } = await import("./lyrics.js");
      clearLyrics();

      expect(mockTextArea.value).toBe('');

      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
    });

    test("should handle missing textarea gracefully", async () => {
      jest.resetModules();

      const originalGetElementById = global.document.getElementById;
      Object.defineProperty(global.document, 'getElementById', {
        value: jest.fn(() => null),
        writable: true,
        configurable: true
      });

      const { clearLyrics } = await import("./lyrics.js");

      expect(() => clearLyrics()).not.toThrow();

      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
    });
  });

  describe("copyFromClipboard", () => {
    test("should read from clipboard and set textarea value", async () => {
      jest.resetModules();

      const clipboardText = "Clipboard content";
      const mockTextArea = { value: '' };
      const mockReadText = jest.fn(() => Promise.resolve(clipboardText));

      const originalClipboard = global.navigator.clipboard;
      const originalGetElementById = global.document.getElementById;

      Object.defineProperty(global.navigator, 'clipboard', {
        value: {
          writeText: jest.fn(),
          readText: mockReadText,
        },
        writable: true,
        configurable: true
      });

      Object.defineProperty(global.document, 'getElementById', {
        value: jest.fn((id) => {
          if (id === "inputTextArea") return mockTextArea;
          return null;
        }),
        writable: true,
        configurable: true
      });

      const { copyFromClipboard } = await import("./lyrics.js");
      await copyFromClipboard();

      expect(mockReadText).toHaveBeenCalled();
      expect(mockTextArea.value).toBe(clipboardText);

      Object.defineProperty(global.navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true
      });
      Object.defineProperty(global.document, 'getElementById', {
        value: originalGetElementById,
        writable: true,
        configurable: true
      });
    });

    test("should handle clipboard read error", async () => {
      const mockReadText = jest.fn(() => Promise.reject(new Error("Clipboard error")));

      const originalClipboard = global.navigator.clipboard;
      Object.defineProperty(global.navigator, 'clipboard', {
        value: {
          writeText: jest.fn(),
          readText: mockReadText,
        },
        writable: true,
        configurable: true
      });

      const { copyFromClipboard } = await import("./lyrics.js");

      // Should not throw error
      await expect(copyFromClipboard()).resolves.toBeUndefined();

      Object.defineProperty(global.navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true
      });
    });
  });
});
