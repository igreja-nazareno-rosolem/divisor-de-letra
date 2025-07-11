import { divideLyrics, copyOutputText, clearLyrics } from "./utils/lyrics.js";

export function doAlmostEverything() {
  copyOutputText(divideLyrics());
  clearLyrics();
}

// Add event listener when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const divideButton = document.getElementById("divideButton");
  if (divideButton) {
    divideButton.addEventListener("click", doAlmostEverything);
  }
});
