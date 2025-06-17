import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Music, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Author, Song } from "@/types";
import { apiService } from "@/services/api";
import { toTitleCase } from "@/lib/text-utils";
import AuthorAvatar from "@/components/AuthorAvatar";

export default function AuthorPage() {
  const { authorID } = useParams<{ authorID: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!authorID) return;

      try {
        setLoading(true);

        // Fetch author details and their songs
        const [authorData, songsData] = await Promise.all([
          apiService.getAuthorById(authorID),
          apiService.getSongsByAuthor(authorID),
        ]);

        setAuthor(authorData);
        setSongs(Array.isArray(songsData) ? songsData : []);
        setFilteredSongs(Array.isArray(songsData) ? songsData : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorID]);

  useEffect(() => {
    let filtered = songs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((song) =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSongs(filtered);
  }, [searchTerm, songs]);



  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="grid md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/authors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Authors
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            {error || "Author not found"}. Please try again or go back to the
            authors list.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/authors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Authors
        </Link>
      </Button>

      {/* Author Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <AuthorAvatar author={author} size="xl" />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {toTitleCase(author.name)}
            </h1>
            <p className="text-lg text-muted-foreground">Lyricist & Poet</p>
          </div>
        </div>
      </div>

      {/* Songs Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Songs & Compositions</h2>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredSongs.length} of {songs.length} songs
          </p>
        </div>

        {/* Songs Grid */}
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No songs found</h3>
            <p className="text-muted-foreground">
              {songs.length === 0
                ? "This author doesn't have any songs in our database yet."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => (
              <Card
                key={song.id}
                className="hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="line-clamp-2 text-lg min-h-[3.5rem]">
                    {toTitleCase(song.title)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    {/* Action Button */}
                    <div className="">
                      <Button asChild size="sm" className="w-full">
                        <Link to={`/songs/${song.id}`}>View Song</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
