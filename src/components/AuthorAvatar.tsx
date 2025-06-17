import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Author } from "@/types";
import {
  getAuthorInitials,
  getAllPossibleAuthorImageUrls,
} from "@/lib/author-utils";
import { cn } from "@/lib/utils";

interface AuthorAvatarProps {
  author: Author;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

export default function AuthorAvatar({
  author,
  size = "md",
  className,
}: AuthorAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tryLoadImage = async () => {
      const possibleUrls = getAllPossibleAuthorImageUrls(author.id);

      for (const url of possibleUrls) {
        try {
          // Create a promise that resolves when the image loads successfully
          await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = url;
          });

          // If we get here, the image loaded successfully
          setImageUrl(url);
          setIsLoading(false);
          return;
        } catch {
          // Continue to next URL
          continue;
        }
      }

      // No image found
      setImageUrl(null);
      setIsLoading(false);
    };

    tryLoadImage();
  }, [author.id]);

  const initials = getAuthorInitials(author.name);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageUrl && !isLoading && (
        <AvatarImage
          src={imageUrl}
          alt={`${author.name} profile picture`}
          className="object-cover grayscale"
        />
      )}
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
