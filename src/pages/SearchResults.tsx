import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Music, User, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/services/api";
import { Song, Author } from "@/types";
import AuthorAvatar from "@/components/AuthorAvatar";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(query);
  const [songs, setSongs] = useState<Song[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localQuery);
  };

  useEffect(() => {
    if (!query.trim()) {
      setSongs([]);
      setAuthors([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiService.globalSearch(query);
        setSongs(data.songs || []);
        setAuthors(data.authors || []);
      } catch (err) {
        setError("Failed to fetch search results. Please try again.");
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const totalResults = songs.length + authors.length;

  return (
    <div className="min-h-screen">
      <div className="px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Results</h1>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative max-w-2xl">
            <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search for songs, artists, or lyricists..."
              className="pl-12 h-14 text-lg pr-24"
            />
            <Button
              type="submit"
              className="absolute right-2 top-2 h-10"
              disabled={loading}
            >
              Search
            </Button>
          </form>

          {query && (
            <p className="text-muted-foreground mt-2">
              Showing results for:{" "}
              <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Searching...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && query && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Found {totalResults} result{totalResults !== 1 ? "s" : ""}
              </span>
              {songs.length > 0 && (
                <Badge variant="secondary">{songs.length} songs</Badge>
              )}
              {authors.length > 0 && (
                <Badge variant="secondary">{authors.length} authors</Badge>
              )}
            </div>

            {/* Authors Results */}
            {authors.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Authors ({authors.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {authors.map((author, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <AuthorAvatar author={author} size="md" />
                          <div className="flex-1">
                            <Link
                              to={`/authors/${author.id}`}
                              className="font-semibold text-primary hover:underline"
                            >
                              {author.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Lyricist
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Songs Results */}
            {songs.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Music className="h-6 w-6" />
                  Songs ({songs.length})
                </h2>
                <div className="grid gap-4">
                  {songs.map((song, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          <Link
                            to={`/songs/${song.id}`}
                            className="text-primary hover:underline"
                          >
                            {song.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          {song.english_lyrics && (
                            <div className="md:col-span-2">
                              <p className="font-medium text-muted-foreground mb-1">
                                Preview
                              </p>
                              <p className="line-clamp-2">
                                {song.english_lyrics.substring(0, 150)}...
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {totalResults === 0 && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No results found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any songs or authors matching "{query}".
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Try:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Checking your spelling</li>
                      <li>Using different keywords</li>
                      <li>Searching for partial song titles</li>
                      <li>Looking for author names</li>
                    </ul>
                  </div>
                  <div className="mt-6 space-x-4">
                    <Button variant="outline" asChild>
                      <Link to="/songs">Browse All Songs</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/authors">Browse All Authors</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Search for content</h3>
              <p className="text-muted-foreground">
                Enter a search term above to find songs and authors in our
                library.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
