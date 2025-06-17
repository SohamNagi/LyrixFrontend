/**
 * Utility functions for text formatting
 */

/**
 * Convert text to title case (capitalizes first letter of each word)
 * Handles special cases like prepositions and articles
 */
export function toTitleCase(text: string): string {
  if (!text) return "";

  // Words that should remain lowercase in title case (except at beginning)
  const lowercaseWords = [
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "if",
    "in",
    "nor",
    "of",
    "on",
    "or",
    "so",
    "the",
    "to",
    "up",
    "yet",
  ];

  return text
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      // Always capitalize first word
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      // Keep lowercase words lowercase unless they're the first word
      if (lowercaseWords.includes(word)) {
        return word;
      }

      // Capitalize other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Capitalize the first letter of a text while preserving the rest
 */
export function capitalizeFirst(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Truncate text to a specific number of lines and add ellipsis
 * Useful for consistent card heights
 */
export function truncateToLines(text: string, maxLines: number = 2): string {
  if (!text) return "";

  const lines = text.split("\n");
  if (lines.length <= maxLines) {
    return text;
  }

  return lines.slice(0, maxLines).join("\n") + "...";
}

/**
 * Clean and format lyrics preview
 * Capitalizes first letter and handles line breaks
 */
export function formatLyricsPreview(
  lyrics: string,
  maxLength: number = 100
): string {
  if (!lyrics) return "";

  // Get first line and clean it
  const firstLine = lyrics.split("\n")[0].trim();

  // Capitalize first letter
  const capitalized = capitalizeFirst(firstLine);

  // Truncate if too long
  if (capitalized.length > maxLength) {
    return capitalized.substring(0, maxLength).trim() + "...";
  }

  return capitalized + "...";
}
