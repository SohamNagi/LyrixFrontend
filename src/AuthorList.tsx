import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Users, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Author } from "@/types";
import { apiService } from "@/services/api";
import { toTitleCase } from "@/lib/text-utils";
import { getAuthorImageUrl } from "@/lib/author-utils";
import AuthorAvatar from "@/components/AuthorAvatar";
import { AuthorCardSkeleton } from "@/components/CardSkeletons";
import { FadeTransition } from "@/components/FadeTransition";
import { CardFadeIn } from "@/components/CardFadeIn";

// Extended Author type with preloaded image URL
interface AuthorWithImage extends Author {
  imageUrl?: string;
}

export default function AuthorList() {
  const [allAuthors, setAllAuthors] = useState<AuthorWithImage[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<AuthorWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  // Helper function to preload image for an author
  const preloadAuthorImage = async (
    author: Author
  ): Promise<AuthorWithImage> => {
    const directImageUrl = getAuthorImageUrl(author.id);

    if (directImageUrl) {
      try {
        // Test if the image actually loads
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = directImageUrl;
        });

        // If we get here, the image loaded successfully
        return { ...author, imageUrl: directImageUrl };
      } catch {
        // Image failed to load
        return { ...author };
      }
    }

    // No image mapping found
    return { ...author };
  };

  // Calculate pagination for filtered results
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAuthors = filteredAuthors.slice(startIndex, endIndex);

    return {
      data: paginatedAuthors,
      page: currentPage,
      per_page: ITEMS_PER_PAGE,
      total: filteredAuthors.length,
      pages: Math.ceil(filteredAuthors.length / ITEMS_PER_PAGE),
    };
  };

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const authorsData = await apiService.getAuthorsPaginated(1, 1000); // Get all authors

      // Preload images for all authors in parallel
      const authorsWithImages = await Promise.all(
        authorsData.data.map((author) => preloadAuthorImage(author))
      );

      setAllAuthors(authorsWithImages);
      setFilteredAuthors(authorsWithImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter authors when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAuthors(allAuthors);
    } else {
      const filtered = allAuthors.filter((author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAuthors(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, allAuthors]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = getPaginatedData();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading authors: {error}. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Users className="h-10 w-10 text-primary" />
          Authors & Poets
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover the brilliant words of 30 celebrated lyricists and poets
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
      </div>

      {/* Authors Grid */}
      {!paginatedData.data || paginatedData.data.length === 0 ? (
        loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AuthorCardSkeleton />
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No authors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )
      ) : (
        <FadeTransition
          loading={loading}
          skeleton={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AuthorCardSkeleton count={paginatedData.data.length || 12} />
            </div>
          }
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedData.data.map((author, index) => (
              <CardFadeIn key={author.id} delay={index * 50}>
                <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <AuthorAvatar
                          author={author}
                          size="lg"
                          preloadedImageUrl={author.imageUrl}
                        />
                        <div className="flex-1 flex items-center">
                          <CardTitle className="line-clamp-2 leading-6">
                            {toTitleCase(author.name)}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                      {/* Song Count */}
                      {author.song_count !== undefined && (
                        <div className="text-sm text-muted-foreground">
                          {author.song_count}{" "}
                          {author.song_count === 1 ? "song" : "songs"}
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="mt-auto">
                        <Link
                          to={`/authors/${author.id}`}
                          className="block w-full"
                        >
                          <div className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium text-center transition-colors">
                            View Profile
                          </div>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardFadeIn>
            ))}
          </div>
        </FadeTransition>
      )}

      {/* Pagination */}
      {paginatedData && paginatedData.pages > 1 && !loading && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(5, paginatedData.pages) },
                (_, i) => {
                  const pageNum =
                    currentPage <= 3
                      ? i + 1
                      : currentPage >= paginatedData.pages - 2
                      ? paginatedData.pages - 4 + i
                      : currentPage - 2 + i;

                  if (pageNum < 1 || pageNum > paginatedData.pages) return null;

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              {paginatedData.pages > 5 &&
                currentPage < paginatedData.pages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < paginatedData.pages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= paginatedData.pages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
