// Utility functions for handling author images

// Available image extensions in order of preference
const IMAGE_EXTENSIONS = ["jpeg", "jpg", "png", "webp", "avif"];

/**
 * Gets all possible image URLs for an author (for fallback handling)
 * @param authorId - The ID of the author
 * @returns Array of possible image URLs in order of preference
 */
export function getAllPossibleAuthorImageUrls(
  authorId: number | string
): string[] {
  return IMAGE_EXTENSIONS.map(
    (ext) => `/authors/${authorId}.${ext}`
  );
}

/**
 * Gets the author's initials for fallback display
 * @param authorName - The name of the author
 * @returns The initials (max 2 characters)
 */
export function getAuthorInitials(authorName: string): string {
  return authorName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}
