import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router";
import { Music, User, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Song, Author, PaginatedResponse } from "@/types";
import { apiService } from "@/services/api";
import { toTitleCase, formatLyricsPreview } from "@/lib/text-utils";

export default function SongList() {
  const [paginatedSongs, setPaginatedSongs] =
    useState<PaginatedResponse<Song> | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const ITEMS_PER_PAGE = 12;

  const fetchSongs = useCallback(
    async (
      page: number = 1,
      search?: string,
      authorId?: string,
      isInitialLoad = false
    ) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }

        let songsData;

        if (search && search.trim()) {
          // Use search API when there's a search term
          songsData = await apiService.searchSongs(
            search.trim(),
            page,
            ITEMS_PER_PAGE,
            authorId
          );
        } else {
          // Use regular paginated API when no search term
          songsData = await apiService.getSongsPaginated(
            page,
            ITEMS_PER_PAGE,
            undefined,
            authorId
          );
        }

        setPaginatedSongs(songsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authorsData = await apiService.getAllAuthors();
        setAuthors(Array.isArray(authorsData) ? authorsData : []);
      } catch (err) {
        console.error("Failed to fetch authors:", err);
        setAuthors([]); // Ensure authors is always an array
      }
    };

    fetchAuthors();
    fetchSongs(1, undefined, undefined, true);
  }, [fetchSongs]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchSongs(
        1,
        searchTerm || undefined,
        selectedAuthor !== "all" ? selectedAuthor : undefined
      );
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, selectedAuthor, fetchSongs]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchSongs(
        page,
        searchTerm || undefined,
        selectedAuthor !== "all" ? selectedAuthor : undefined
      );
    },
    [fetchSongs, searchTerm, selectedAuthor]
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading songs: {error}. Please try again later.
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
          <Music className="h-10 w-10 text-primary" />
          Song Library
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore our collection of 1314 songs and their poetic interpretations
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search songs or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={selectedAuthor}
              onValueChange={setSelectedAuthor}
              disabled={loading}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {Array.isArray(authors) &&
                  authors.map((author) => (
                    <SelectItem key={author.id} value={author.id.toString()}>
                      {author.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Songs Grid */}
      {!paginatedSongs?.data || paginatedSongs.data.length === 0 ? (
        <div className="text-center py-12">
          <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No songs found</h3>
          <p className="text-muted-foreground">
            {loading
              ? "Loading..."
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${
              loading ? "opacity-50" : ""
            }`}
          >
            {paginatedSongs.data.map((song) => (
              <Card
                key={song.id}
                className="hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="line-clamp-2 min-h-[3rem] leading-6">
                    {toTitleCase(song.title)}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">
                      {toTitleCase(song.author.name)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    {/* Action Button */}
                    <div className="mt-auto">
                      <Button asChild className="w-full">
                        <Link to={`/songs/${song.id}`}>Explore Song</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {paginatedSongs && paginatedSongs.pages > 1 && (
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
                    { length: Math.min(5, paginatedSongs.pages) },
                    (_, i) => {
                      const pageNum =
                        currentPage <= 3
                          ? i + 1
                          : currentPage >= paginatedSongs.pages - 2
                          ? paginatedSongs.pages - 4 + i
                          : currentPage - 2 + i;

                      if (pageNum < 1 || pageNum > paginatedSongs.pages)
                        return null;

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

                  {paginatedSongs.pages > 5 &&
                    currentPage < paginatedSongs.pages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < paginatedSongs.pages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage >= paginatedSongs.pages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
