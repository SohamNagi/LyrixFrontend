// Utility functions for handling author images
import authorImageMappings from "@/data/author-images.json";

/**
 * Gets the specific image URL for an author if it exists
 * @param authorId - The ID of the author
 * @returns The image URL if it exists, null otherwise
 */
export function getAuthorImageUrl(authorId: number | string): string | null {
  const id = authorId.toString();
  const filename = authorImageMappings[id as keyof typeof authorImageMappings];

  if (filename) {
    return `/authors/${filename}`;
  }

  return null;
}

/**
 * Gets all possible image URLs for an author (for fallback handling)
 * @param authorId - The ID of the author
 * @returns Array of possible image URLs (now just one or empty)
 * @deprecated Use getAuthorImageUrl instead for better performance
 */
export function getAllPossibleAuthorImageUrls(
  authorId: number | string
): string[] {
  const imageUrl = getAuthorImageUrl(authorId);
  return imageUrl ? [imageUrl] : [];
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
