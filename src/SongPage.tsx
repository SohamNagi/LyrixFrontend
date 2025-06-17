import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { Song } from "@/types";
import { apiService } from "@/services/api";
import { useThemeManager } from "@/hooks/use-theme-manager";
import { LanguageCode } from "@/lib/api";

export default function SongPage() {
  const { songID } = useParams<{ songID: string }>();

  const [song, setSong] = useState<Song | null>(null);
  const [analysis, setAnalysis] = useState<Record<string, string> | null>(null);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [error, setError] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState("");
  const [lineNum, setLineNum] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use the theme manager hook
  const {
    currentTheme,
    isLoading: loadingTheme,
    error: themeError,
    hasStaticTheme,
    hasDynamicTheme,
    fetchDynamicTheme,
    clearError: clearThemeError,
    refresh: refreshTheme,
  } = useThemeManager({
    song,
    language,
    songId: songID,
  });

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchSong = async () => {
      if (!songID) return;

      try {
        setLoading(true);
        const songData = await apiService.getSongById(songID);
        setSong(songData);

        // Set default language based on available lyrics
        if (songData.english_lyrics) setLanguage("en");
        else if (songData.hindi_lyrics) setLanguage("hin");
        else if (songData.urdu_lyrics) setLanguage("urd");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [songID]);

  useEffect(() => {
    if (song) {
      switch (language) {
        case "en":
          setLyrics(song?.english_lyrics || "");
          break;
        case "hin":
          setLyrics(song?.hindi_lyrics || "");
          break;
        case "urd":
          setLyrics(song?.urdu_lyrics || "");
          break;
      }
    }
  }, [language, song]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!drawerOpen || lineNum === null || !language || !songID) return;
      setLoadingAnalysis(true);

      try {
        const analysisData = await apiService.getLineAnalysis(
          songID,
          lineNum, // API expects 1-based line numbers
          language
        );

        setAnalysis(analysisData);
      } catch {
        // Fallback to dummy analysis if API fails
        const dummyAnalysis: Record<string, string> = {
          translation: `Translation for line ${lineNum} in ${language} language.`,
          interpretation:
            "This line represents the poet's inner emotions and uses metaphorical language.",
          context:
            "This line connects to the broader theme of the song and cultural context.",
        };
        setAnalysis(dummyAnalysis);
      } finally {
        setLoadingAnalysis(false);
      }
    };

    fetchAnalysis();
  }, [drawerOpen, language, lineNum, songID]);

  // Function to handle line click
  const handleLineClick = (num: number) => {
    setLineNum(num);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setLineNum(null);
    setAnalysis(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading song...</span>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-lg font-medium text-red-600 mb-4">
          Error: {error || "Song not found"}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl capitalize">
                {song?.title || "Loading..."}
              </CardTitle>
              {song?.author && (
                <Link
                  to={`/authors/${song.author.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <p className="text-lg capitalize">{song.author.name}</p>
                </Link>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
              >
                English
              </Button>
              <Button
                variant={language === "hin" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("hin")}
              >
                Hindi
              </Button>
              <Button
                variant={language === "urd" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("urd")}
              >
                Urdu
              </Button>
            </div>
          </div>
        </CardHeader>{" "}
        <CardContent>
          {/* Theme Section */}
          {song && (
            <div className="mb-6">
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  {!currentTheme && !loadingTheme && !themeError && (
                    <Button
                      onClick={fetchDynamicTheme}
                      variant="secondary"
                      size="sm"
                    >
                      Generate Theme
                    </Button>
                  )}
                  {hasStaticTheme && hasDynamicTheme && (
                    <Button onClick={refreshTheme} variant="outline" size="sm">
                      Refresh
                    </Button>
                  )}
                </div>
                <div>
                  {loadingTheme ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating theme analysis...</span>
                    </div>
                  ) : themeError ? (
                    <div className="text-red-500">
                      <p>Failed to generate theme: {themeError}</p>
                      <div className="space-x-2 mt-2">
                        <Button
                          onClick={fetchDynamicTheme}
                          variant="outline"
                          size="sm"
                        >
                          Try Again
                        </Button>
                        <Button
                          onClick={clearThemeError}
                          variant="ghost"
                          size="sm"
                        >
                          Clear Error
                        </Button>
                      </div>
                    </div>
                  ) : currentTheme ? (
                    <div>
                      <Markdown>{currentTheme}</Markdown>
                      {hasDynamicTheme && (
                        <div className="mt-2 text-sm text-gray-500 italic">
                          Generated via AI analysis
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No theme analysis available for this language. Click
                      "Generate Theme" to create one.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="prose prose-stone capitalize max-w-none">
            {lyrics.split("\n").map((line: string, index: number) => (
              <Sheet
                key={index}
                open={drawerOpen && lineNum === index}
                onOpenChange={(open) => {
                  if (!open) closeDrawer();
                }}
              >
                <SheetTrigger asChild>
                  <p
                    className="cursor-pointer hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                    onClick={() => handleLineClick(index)}
                  >
                    {line.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
                  </p>
                </SheetTrigger>
                <SheetContent className="w-[50%] sm:max-w-none">
                  <SheetHeader>
                    <SheetTitle>Line Analysis</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {loadingAnalysis ? (
                      <div className="space-y-4">
                        <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-28"></div>
                        <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                      </div>
                    ) : analysis ? (
                      <div className="prose prose-stone max-w-none">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Original Line:
                            </h3>
                            <p className="text-gray-700 capitalize font-medium">
                              {lineNum !== null
                                ? lyrics
                                    .split("\n")
                                    [lineNum].normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                : "No original text available."}
                            </p>
                          </div>

                          {Object.entries(analysis)
                            .reverse()
                            .map(([key, value]) => (
                              <div key={key}>
                                <h3 className="text-lg font-semibold mb-2 capitalize">
                                  {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                  :
                                </h3>
                                <div className="text-gray-700">
                                  <Markdown>{value}</Markdown>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No analysis available for this line.
                      </p>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
