import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Song {
  title: string;
  hindiLyrics: string;
  urduLyrics: string;
  englishLyrics: string;
  hindiTheme: string | null;
  urduTheme: string | null;
  englishTheme: string | null;
  _links: {
    self: { href: string };
    song: { href: string };
    analyses: { href: string };
    author: { href: string };
  };
}

interface Analysis {
  translation: string;
  interpretation: string;
  connectionsToContext: string;
}

export default function SongPage() {
  const { songID } = useParams<{ songID: string }>();

  // Dummy song data for testing
  const dummySong: Song = {
    title: "Ae Dil Hai Mushkil",
    englishLyrics:
      "It's difficult, oh heart\nLove is not easy\nTo live without you\nIs impossible for me\nEvery moment without you\nFeels like an eternity\nYour memories haunt me\nDay and night",
    hindiLyrics:
      "ऐ दिल है मुश्किल\nजीना यहाँ\nज़रा हटके\nज़रा बचके\nये है बम्बई मेरी जान\nयहाँ पे तेरा\nसब्र करना\nपड़ता है काम",
    urduLyrics:
      "اے دل ہے مشکل\nجینا یہاں\nذرا ہٹ کے\nذرا بچ کے\nیہ ہے بمبئی میری جان\nیہاں پے تیرا\nصبر کرنا\nپڑتا ہے کام",
    hindiTheme: "दिल की परेशानी और प्रेम की कठिनाइयों के बारे में",
    urduTheme: "دل کی پریشانی اور محبت کی مشکلات کے بارے میں",
    englishTheme: "About the troubles of the heart and difficulties of love",
    _links: {
      self: { href: "/songs/1234" },
      song: { href: "/songs/1234" },
      analyses: { href: "/songs/1234/analyses" },
      author: { href: "/authors/5678" },
    },
  };

  const [song, setSong] = useState<Song | null>(dummySong);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [language, setLanguage] = useState<"en" | "hin" | "urd">("en");
  // const [error, setError] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState(dummySong.englishLyrics);
  const [lineNum, setLineNum] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [name, setName] = useState("Arijit Singh");
  const [aid, setAid] = useState("5678");

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
      try {
        // Use dummy data for testing
        const dummySongData: Song = {
          title: "Ae Watan Mere Watan",
          hindiLyrics:
            "ऐ वतन मेरे वतन\nतुझ पे दिल कुर्बान\nतू ही मेरी मंजिल\nतू ही मेरा इमान\nऐ वतन मेरे वतन\nतुझ पे दिल कुर्बान",
          urduLyrics:
            "اے وطن میرے وطن\nتجھ پہ دل قربان\nتو ہی میری منزل\nتو ہی میرا ایمان\nاے وطن میرے وطن\nتجھ پہ دل قربان",
          englishLyrics:
            "O my homeland, my homeland\nI sacrifice my heart for you\nYou are my destination\nYou are my faith\nO my homeland, my homeland\nI sacrifice my heart for you",
          hindiTheme: "देशभक्ति और समर्पण",
          urduTheme: "وطن سے محبت اور قربانی",
          englishTheme: "Patriotism and devotion",
          _links: {
            self: { href: `/songs/${songID}` },
            song: { href: `/songs/${songID}` },
            analyses: { href: `/songs/${songID}/analyses` },
            author: { href: `/authors/1` },
          },
        };

        setSong(dummySongData);

        // Set dummy author data
        setName("Kavi Pradeep");
        setAid("1");

        // Uncomment below for real API calls
        // const response = await fetch(`${BASE_URL}songs/${songID}`);
        // if (!response.ok) throw new Error("Failed to fetch lyrics");
        // const songData = (await response.json()) as Song;
        // setSong(songData);
        // const nresponse = await fetch(songData._links.author.href);
        // if (!nresponse.ok) {
        //   throw new Error("Can't Fetch Name!");
        // }
        // const n = (await nresponse.json()) as AuthorResponse;
        // setName(n.name);
        // const match = n._links.author.href.match(/\/authors\/(\d+)$/);
        // if (match) {
        //   setAid(match[1]);
        // } else {
        //   setAid("");
        // }
      } catch (error) {
        // setError((error as Error).message);
      }
    };
    fetchSong();
  }, [songID]);

  useEffect(() => {
    if (song) {
      switch (language) {
        case "en":
          setLyrics(song?.englishLyrics);
          break;
        case "hin":
          setLyrics(song?.hindiLyrics);
          break;
        case "urd":
          setLyrics(song?.urduLyrics);
          break;
      }
    }
  }, [language, song]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!drawerOpen || lineNum === null || !language) return;
      setLoadingAnalysis(true);

      // Simulate API delay
      setTimeout(() => {
        // Dummy analysis data
        const dummyAnalysis: Analysis = {
          translation: `This is a sample translation for line ${
            lineNum + 1
          } in ${language} language. The line expresses deep emotional content about love and longing.`,
          interpretation: `This line represents the poet's inner turmoil and the complexity of human emotions. It uses metaphorical language to convey the difficulty of expressing one's feelings, especially in matters of the heart.`,
          connectionsToContext: `This line connects to the broader theme of the song which deals with unrequited love and the challenges of modern relationships. It reflects the cultural context of contemporary Indian poetry and music.`,
        };
        setAnalysis(dummyAnalysis);
        setLoadingAnalysis(false);
      }, 1000);
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

  // if (error)
  //   return (
  //     <div className="flex flex-col items-center justify-center p-8">
  //       <p className="text-lg font-medium text-red-600 mb-4">Error: {error}</p>
  //       <Button onClick={() => window.location.reload()}>Retry</Button>
  //     </div>
  //   );

  // if (!song)
  //   return (
  //     <div className="flex items-center justify-center p-8">
  //       <Loader2 className="h-6 w-6 animate-spin" />
  //       <span className="ml-2">Loading song...</span>
  //     </div>
  //   );

  return (
    <div className="min-h-screen">
      <div className="h-full">
        <Card className="border-0 rounded-none">
          <CardHeader className="border-b">
            <CardTitle className="text-3xl capitalize">
              {song?.title || "Loading..."}
            </CardTitle>
            {name && (
              <Link
                to={`/authors/${aid}`}
                className="text-primary hover:underline"
              >
                <p className="text-lg capitalize">by {name}</p>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
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

            <div className="prose prose-stone max-w-none">
              {lyrics.split("\n").map((line, index) => (
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
                      {line}
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
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Original Line:
                            </h3>
                            <p className="text-gray-700">
                              {lineNum !== null
                                ? song?.englishLyrics.split("\n")[lineNum]
                                : "No original text available."}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Translation:
                            </h3>
                            <p className="text-gray-700">
                              {analysis.translation ||
                                "No translation available."}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Interpretation:
                            </h3>
                            <p className="text-gray-700">
                              {analysis.interpretation ||
                                "No interpretation available."}
                            </p>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Connections to Context:
                            </h3>
                            <p className="text-gray-700">
                              {analysis.connectionsToContext ||
                                "No connections available."}
                            </p>
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
    </div>
  );
}
