import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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

interface responseList {
  _embedded: {
    songs: Song[];
  };
  _links: {
    self: { href: string };
    first?: { href: string };
    next?: { href: string };
    last?: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export default function AuthorPage() {
  const [songList, setSongList] = useState<responseList>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const { authorID } = useParams<{ authorID: string }>();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Extended dummy data for testing - showing more songs for Kavi Pradeep
        const allDummySongs: Song[] = [
          {
            title: "Ae Watan Mere Watan",
            hindiLyrics: "ऐ वतन मेरे वतन...",
            urduLyrics: "اے وطن میرے وطن...",
            englishLyrics: "O my homeland, my homeland...",
            hindiTheme: "देशभक्ति",
            urduTheme: "وطن سے محبت",
            englishTheme: "Patriotism",
            _links: {
              self: { href: "/songs/1234" },
              song: { href: "/songs/1234" },
              analyses: { href: "/songs/1234/analyses" },
              author: { href: `/authors/${authorID}` },
            },
          },
          {
            title: "De Di Hamein Azadi",
            hindiLyrics: "दे दी हमें आज़ादी...",
            urduLyrics: "دے دی ہمیں آزادی...",
            englishLyrics: "We have been given freedom...",
            hindiTheme: "स्वतंत्रता",
            urduTheme: "آزادی",
            englishTheme: "Freedom",
            _links: {
              self: { href: "/songs/1235" },
              song: { href: "/songs/1235" },
              analyses: { href: "/songs/1235/analyses" },
              author: { href: `/authors/${authorID}` },
            },
          },
          {
            title: "Aao Bacchon Tumhen Dikhayein",
            hindiLyrics: "आओ बच्चों तुम्हें दिखाएं...",
            urduLyrics: "آؤ بچو تمہیں دکھاؤں...",
            englishLyrics: "Come children, let us show you...",
            hindiTheme: "शिक्षा और देशभक्ति",
            urduTheme: "تعلیم اور دیش بھکتی",
            englishTheme: "Education and patriotism",
            _links: {
              self: { href: "/songs/1236" },
              song: { href: "/songs/1236" },
              analyses: { href: "/songs/1236/analyses" },
              author: { href: `/authors/${authorID}` },
            },
          },
          {
            title: "Zindagi Kaisi Hai Paheli Haye",
            hindiLyrics: "ज़िन्दगी कैसी है पहेली हाए...",
            urduLyrics: "زندگی کیسی ہے پہیلی ہائے...",
            englishLyrics: "Life is such a puzzle, oh...",
            hindiTheme: "जीवन की जटिलता",
            urduTheme: "زندگی کی پیچیدگی",
            englishTheme: "Complexity of life",
            _links: {
              self: { href: "/songs/1237" },
              song: { href: "/songs/1237" },
              analyses: { href: "/songs/1237/analyses" },
              author: { href: `/authors/${authorID}` },
            },
          },
          {
            title: "Jago Mohan Pyare",
            hindiLyrics: "जागो मोहन प्यारे...",
            urduLyrics: "جاگو موہن پیارے...",
            englishLyrics: "Wake up, dear beloved...",
            hindiTheme: "भक्ति और प्रेम",
            urduTheme: "بھکتی اور محبت",
            englishTheme: "Devotion and love",
            _links: {
              self: { href: "/songs/1238" },
              song: { href: "/songs/1238" },
              analyses: { href: "/songs/1238/analyses" },
              author: { href: `/authors/${authorID}` },
            },
          },
          {
            title: "Door Hato Ae Duniya Walo",
            hindiLyrics: "दूर हटो ऐ दुनिया वालो...",
            urduLyrics: "دور ہٹو اے دنیا والو...",
            englishLyrics: "Move away, O people of the world...",
            hindiTheme: "समाज सुधार",
            urduTheme: "معاشرتی اصلاح",
            englishTheme: "Social reform",
            _links: {
              self: { href: "/songs/1239" },
              song: { href: "/songs/1239" },
              analyses: { href: "/songs/1239/analyses" },
              author: { href: `/authors/${authorID}` },
            },
          },
          {
            title: "Hum Laye Hain Toofan Se",
            hindiLyrics: "हम लाए हैं तूफान से...",
            urduLyrics: "ہم لائے ہیں طوفان سے...",
            englishLyrics: "We have brought from the storm...",
            hindiTheme: "संघर्ष और विजय",
            urduTheme: "جدوجہد اور فتح",
            englishTheme: "Struggle and victory",
            _links: {
              self: { href: "/songs/1240" },
              song: { href: "/songs/1240" },
              analyses: { href: "/songs/1240/analyses" },
              author: { href: `/authors/${authorID}` },
            },
          },
          {
            title: "Chal Chal Re Naujawan",
            hindiLyrics: "चल चल रे नौजवान...",
            urduLyrics: "چل چل رے نوجوان...",
            englishLyrics: "Come on, young person...",
            hindiTheme: "युवा प्रेरणा",
            urduTheme: "نوجوانوں کی حوصلہ افزائی",
            englishTheme: "Youth inspiration",
            _links: {
              self: { href: "/songs/1241" },
              song: { href: "/songs/1241" },
              analyses: { href: "/songs/1241/analyses" },
              author: { href: `/authors/${authorID}` },
            },
          },
        ];

        const startIndex = page * 5;
        const endIndex = startIndex + 5;
        const currentPageSongs = allDummySongs.slice(startIndex, endIndex);

        const dummyResponse: responseList = {
          _embedded: {
            songs: currentPageSongs,
          },
          _links: {
            self: { href: `/authors/${authorID}/songList?page=${page}&size=5` },
            first: { href: `/authors/${authorID}/songList?page=0&size=5` },
            next:
              page < Math.ceil(allDummySongs.length / 5) - 1
                ? {
                    href: `/authors/${authorID}/songList?page=${
                      page + 1
                    }&size=5`,
                  }
                : undefined,
            last: {
              href: `/authors/${authorID}/songList?page=${
                Math.ceil(allDummySongs.length / 5) - 1
              }&size=5`,
            },
          },
          page: {
            size: 5,
            totalElements: allDummySongs.length,
            totalPages: Math.ceil(allDummySongs.length / 5),
            number: page,
          },
        };

        setSongList(dummyResponse);
        setLoading(false);

        // Uncomment below for real API calls
        // const response = await fetch(`${BASE_URL}${authorID}/songList?page=${page}&size=5`);
        // if (!response.ok) {
        //   throw new Error("Can't Fetch List");
        // }
        // const list = (await response.json()) as responseList;
        // setSongList(list);
        // setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    const fetchName = async () => {
      try {
        // Use dummy data based on authorID
        const authorNames: { [key: string]: string } = {
          "1": "Kavi Pradeep",
          "2": "Gulzar",
          "3": "Javed Akhtar",
          "4": "Sahir Ludhianvi",
          "5": "Anand Bakshi",
          "6": "Kaifi Azmi",
          "7": "Majrooh Sultanpuri",
          "8": "Hasrat Jaipuri",
          "9": "Shakeel Badayuni",
          "10": "Raja Mehdi Ali Khan",
        };

        setName(authorNames[authorID || "1"] || "Unknown Author");

        // Uncomment below for real API calls
        // const response = await fetch(`${BASE_URL}${authorID}`);
        // if (!response.ok) {
        //   throw new Error("Can't Fetch Name!");
        // }
        // const n = (await response.json()) as AuthorResponse;
        // setName(n.name);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchName();
    fetchSongs();
  }, [authorID, page]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading songs...</span>
      </div>
    );

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-lg font-medium text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Card className="border-0 rounded-none flex-1 flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <CardTitle className="text-3xl capitalize">
            {name || "Author"}
          </CardTitle>
          <p className="text-muted-foreground">
            Songs by {name} • {songList?.page.totalElements || 0} total songs
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <Table className="h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Song Name</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="h-full">
                  {songList?._embedded.songs.map((value, index) => (
                    <TableRow key={index} className="h-1/5">
                      <TableCell className="font-medium">
                        {index + 1 + page * 5}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/songs/${value._links.self.href.slice(-4)}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {value.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            to={`/songs/${value._links.self.href.slice(-4)}`}
                          >
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Fill remaining space with empty rows if less than 5 items */}
                  {Array.from({
                    length: 5 - (songList?._embedded.songs.length || 0),
                  }).map((_, index) => (
                    <TableRow key={`empty-${index}`} className="h-1/5">
                      <TableCell>&nbsp;</TableCell>
                      <TableCell>&nbsp;</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                if (page > 0) {
                  setPage(page - 1);
                }
              }}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Page {page + 1} of {songList?.page.totalPages || 1}
              </span>
              <span>•</span>
              <span>{songList?.page.totalElements || 0} total songs</span>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                if (songList && page < songList.page.totalPages - 1) {
                  setPage(page + 1);
                }
              }}
              disabled={!songList || page >= songList.page.totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
