import { showNotification } from "./notification.js";

export function getTitle(first_paragraph) {
  const lines = first_paragraph.split("\n");
  return lines.join(" - ");
}

export function removeParentheses(inputString) {
  // Handle nested parentheses by repeatedly removing innermost parentheses
  let result = inputString;
  while (result.includes('(') && result.includes(')')) {
    const prevResult = result;
    result = result.replace(/\([^()]*\)/g, "");
    // If no change occurred, break to avoid infinite loop
    if (result === prevResult) break;
  }
  return result;
}

export function addTitle(title, lyrics) {
  const titleWithNewline = title + "\n\n";
  return title !== ""
    ? titleWithNewline + "\n" + lyrics
    : lyrics;
}

export function divideLyrics() {
  const textArea = document.getElementById("inputTextArea");
  const parentheses_checkbox = document.getElementById("checkbox-parentheses");
  const lyrics_info_checkbox = document.getElementById("checkbox-lyrics-info");

  if (!textArea || !parentheses_checkbox) {
    return '';
  }

  const input_lyrics = textArea.value;
  const lyrics = parentheses_checkbox.checked
    ? removeParentheses(input_lyrics)
    : input_lyrics;
  const par_lyrics = lyrics.split("\n\n");
  const title = lyrics_info_checkbox.checked
    ? getTitle(par_lyrics.shift())
    : "";
  const break_line_count = par_lyrics.map(
    (par) => (par.match(/\n/g) || []).length
  );
  var aux_list = [];

  for (let i = 0; i < par_lyrics.length; i++) {
    const par = par_lyrics[i];
    const count = break_line_count[i];
    let result = [];
    var aux = par.split("\n");
    for (let i = 0; i < aux.length; i += 2) {
      if (i + 1 < aux.length) {
        result.push(aux[i] + "\n" + aux[i + 1]);
      } else {
        result.push(aux[i] + "\n ");
      }
    }
    aux_list.push(result.join("\n\n"));
  }

  const div_lyrics = aux_list.join("\n\n");
  const div_lyrics_uppercase = div_lyrics.toUpperCase();
  return addTitle(title, div_lyrics_uppercase, lyrics_info_checkbox.checked);
}

export function copyFromClipboard() {
  return navigator.clipboard.readText().then(function (text) {
    const textArea = document.getElementById("inputTextArea");
    if (textArea) {
      textArea.value = text;
    }
  }).catch(function (error) {
    // Handle clipboard read error silently
    console.error('Failed to read clipboard:', error);
  });
}

export function copyOutputText(text) {
  navigator.clipboard.writeText(text);
  showNotification();
}

export function clearLyrics() {
  const textArea = document.getElementById("inputTextArea");
  if (textArea) {
    textArea.value = "";
  }
}