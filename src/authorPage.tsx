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
import { Loader2 } from "lucide-react";

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
  };
}

export default function AuthorPage() {
  const [songList, setSongList] = useState<responseList>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { authorID } = useParams<{ authorID: string }>();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Use dummy data for testing
        const dummySongs: Song[] = [
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
        ];

        const dummyResponse: responseList = {
          _embedded: {
            songs: dummySongs,
          },
          _links: {
            self: { href: `/authors/${authorID}/songList` },
          },
        };

        setSongList(dummyResponse);
        setLoading(false);

        // Uncomment below for real API calls
        // const response = await fetch(`${BASE_URL}${authorID}/songList`);
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
  }, [authorID]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-lg font-medium text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl capitalize">
          {name || "Author"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading songs...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Song Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {songList?._embedded.songs.map((value, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      to={`/songs/${value._links.self.href.slice(-4)}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {value.title}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
