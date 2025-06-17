import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Music,
  User,
  Languages,
  Sparkles,
  BookOpen,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Song, LineAnalysis } from "@/types";
import { apiService } from "@/services/api";

export default function SongPage() {
  const { songID } = useParams<{ songID: string }>();
  const { toast } = useToast();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [lineAnalysis, setLineAnalysis] = useState<LineAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<string>("en");
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const fetchSong = async () => {
      if (!songID) return;

      try {
        setLoading(true);
        const songData = await apiService.getSongById(songID);
        setSong(songData);

        // Set default language based on available lyrics
        if (songData.english_lyrics) setActiveLanguage("en");
        else if (songData.hindi_lyrics) setActiveLanguage("hi");
        else if (songData.urdu_lyrics) setActiveLanguage("ur");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [songID]);

  const fetchLineAnalysis = async (lineNum: number, language: string) => {
    if (!songID) return;

    try {
      setLoadingAnalysis(true);
      const analysisData = await apiService.getLineAnalysis(
        songID,
        lineNum,
        language
      );
      setLineAnalysis(analysisData);
    } catch {
      toast({
        title: "Analysis Unavailable",
        description: "Line analysis is not available for this line.",
        variant: "destructive",
      });
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleLineClick = (lineNum: number) => {
    setSelectedLine(lineNum);
    fetchLineAnalysis(lineNum, activeLanguage);
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));

      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });

      // Reset copy state after 2 seconds
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatLyrics = (lyrics: string) => {
    return lyrics.split("\n").filter((line) => line.trim() !== "");
  };

  const getAvailableLanguages = () => {
    if (!song) return [];

    const languages = [];
    if (song.english_lyrics) languages.push({ code: "en", name: "English" });
    if (song.hindi_lyrics) languages.push({ code: "hi", name: "Hindi" });
    if (song.urdu_lyrics) languages.push({ code: "ur", name: "Urdu" });
    return languages;
  };

  const getCurrentLyrics = () => {
    if (!song) return "";

    switch (activeLanguage) {
      case "hi":
        return song.hindi_lyrics || "";
      case "ur":
        return song.urdu_lyrics || "";
      default:
        return song.english_lyrics || "";
    }
  };

  const getCurrentTheme = () => {
    if (!song) return "";

    switch (activeLanguage) {
      case "hi":
        return song.hindi_theme || "";
      case "ur":
        return song.urdu_theme || "";
      default:
        return song.english_theme || "";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/songs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Songs
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            {error || "Song not found"}. Please try again or go back to the song
            list.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/songs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Songs
        </Link>
      </Button>

      {/* Song Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-lg">
            <Music className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{song.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <Link
                to={`/authors/${song.author.id}`}
                className="hover:text-foreground transition-colors"
              >
                {song.author.name}
              </Link>
            </div>
          </div>
        </div>

        {/* Available Languages */}
        <div className="flex flex-wrap gap-2">
          {getAvailableLanguages().map((lang) => (
            <Badge key={lang.code} variant="outline">
              {lang.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeLanguage} onValueChange={setActiveLanguage}>
            <TabsList className="grid w-full grid-cols-auto">
              {getAvailableLanguages().map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code}>
                  <Languages className="h-4 w-4 mr-2" />
                  {lang.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {getAvailableLanguages().map((lang) => (
              <TabsContent key={lang.code} value={lang.code} className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Lyrics in {lang.name}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            getCurrentLyrics(),
                            `lyrics-${lang.code}`
                          )
                        }
                      >
                        {copiedStates[`lyrics-${lang.code}`] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {formatLyrics(getCurrentLyrics()).map((line, index) => (
                        <p
                          key={index}
                          className={`
                            cursor-pointer p-2 rounded transition-colors
                            hover:bg-muted/50
                            ${
                              selectedLine === index + 1
                                ? "bg-primary/10 border-l-4 border-primary"
                                : ""
                            }
                          `}
                          onClick={() => handleLineClick(index + 1)}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Theme Section */}
                {getCurrentTheme() && (
                  <Card className="mt-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Theme & Interpretation
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              getCurrentTheme(),
                              `theme-${lang.code}`
                            )
                          }
                        >
                          {copiedStates[`theme-${lang.code}`] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {getCurrentTheme()}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Sidebar - Line Analysis */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Line Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLine === null ? (
                <p className="text-muted-foreground text-center py-8">
                  Click on any line in the lyrics to see detailed analysis,
                  translations, and interpretations.
                </p>
              ) : loadingAnalysis ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : lineAnalysis ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Line {selectedLine}</h4>
                    <Separator />
                  </div>

                  {lineAnalysis.english_text && (
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-1">
                        English Translation
                      </h5>
                      <p className="text-sm">{lineAnalysis.english_text}</p>
                    </div>
                  )}

                  {lineAnalysis.romanized_text && (
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-1">
                        Romanized
                      </h5>
                      <p className="text-sm font-mono">
                        {lineAnalysis.romanized_text}
                      </p>
                    </div>
                  )}

                  {lineAnalysis.interpretation && (
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-1">
                        Interpretation
                      </h5>
                      <p className="text-sm leading-relaxed">
                        {lineAnalysis.interpretation}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No analysis available for this line.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
