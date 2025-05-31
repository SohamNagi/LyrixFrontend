import { useEffect, useState } from "react";
import { Link } from "react-router";
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
import { API_ENDPOINTS } from "@/config/api";

const BASE_URL = API_ENDPOINTS.songs;

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
    first: { href: string };
    self: { href: string };
    next: { href: string };
    last: { href: string };
    profile: { href: string };
    search: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export default function SongList() {
  const [page, setPage] = useState(0);

  // Dummy song data for testing
  const dummySongs: Song[] = [
    {
      title: "Ae Dil Hai Mushkil",
      hindiLyrics: "ऐ दिल है मुश्किल...",
      urduLyrics: "اے دل ہے مشکل...",
      englishLyrics: "It's difficult, oh heart...",
      hindiTheme: "दिल की परेशानी",
      urduTheme: "دل کی پریشانی",
      englishTheme: "Heart's troubles",
      _links: {
        self: { href: "/songs/1001" },
        song: { href: "/songs/1001" },
        analyses: { href: "/songs/1001/analyses" },
        author: { href: "/authors/101" },
      },
    },
    {
      title: "Tum Hi Ho",
      hindiLyrics: "तुम ही हो...",
      urduLyrics: "تم ہی ہو...",
      englishLyrics: "You are the one...",
      hindiTheme: "प्रेम और समर्पण",
      urduTheme: "محبت اور وفا",
      englishTheme: "Love and devotion",
      _links: {
        self: { href: "/songs/1002" },
        song: { href: "/songs/1002" },
        analyses: { href: "/songs/1002/analyses" },
        author: { href: "/authors/102" },
      },
    },
    {
      title: "Channa Mereya",
      hindiLyrics: "चन्ना मेरेया...",
      urduLyrics: "چننا میریا...",
      englishLyrics: "My beloved...",
      hindiTheme: "बिछड़न का दुख",
      urduTheme: "جدائی کا غم",
      englishTheme: "Pain of separation",
      _links: {
        self: { href: "/songs/1003" },
        song: { href: "/songs/1003" },
        analyses: { href: "/songs/1003/analyses" },
        author: { href: "/authors/103" },
      },
    },
    {
      title: "Raabta",
      hindiLyrics: "राब्ता...",
      urduLyrics: "رابطہ...",
      englishLyrics: "Connection...",
      hindiTheme: "आत्मिक संबंध",
      urduTheme: "روحانی رشتہ",
      englishTheme: "Spiritual bond",
      _links: {
        self: { href: "/songs/1004" },
        song: { href: "/songs/1004" },
        analyses: { href: "/songs/1004/analyses" },
        author: { href: "/authors/104" },
      },
    },
    {
      title: "Bol Do Na Zara",
      hindiLyrics: "बोल दो ना ज़रा...",
      urduLyrics: "بول دو نا ذرا...",
      englishLyrics: "Just say it once...",
      hindiTheme: "अनकही भावनाएं",
      urduTheme: "ان کہے جذبات",
      englishTheme: "Unspoken feelings",
      _links: {
        self: { href: "/songs/1005" },
        song: { href: "/songs/1005" },
        analyses: { href: "/songs/1005/analyses" },
        author: { href: "/authors/105" },
      },
    },
  ];

  const dummySongList: responseList = {
    _embedded: { songs: dummySongs },
    _links: {
      first: { href: "/songs?page=0" },
      self: { href: `/songs?page=${page}` },
      next: { href: `/songs?page=${page + 1}` },
      last: { href: "/songs?page=2" },
      profile: { href: "/profile/songs" },
      search: { href: "/songs/search" },
    },
    page: {
      size: 13,
      totalElements: 25,
      totalPages: 3,
      number: page,
    },
  };

  const [songList, setSongList] = useState<responseList | null>(dummySongList);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}?page=${page}&size=13`);
        if (!response.ok) {
          throw new Error("Can't Fetch Song List");
        }
        const list = (await response.json()) as responseList;
        setSongList(list);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [page]);

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading songs...</span>
      </div>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Song Library</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 mb-4">
            <p>Error: {error}</p>
          </div>
        )}

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
                <TableCell className="font-medium">
                  {index + 1 + page * 13}
                </TableCell>
                <TableCell>
                  <Link
                    className="capitalize text-blue-600 hover:text-blue-800 hover:underline"
                    to={`/songs/${value._links.self.href.slice(-4)}`}
                  >
                    {value.title}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between mt-6">
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

          <span className="flex items-center text-sm text-gray-600">
            Page {page + 1} of {songList?.page.totalPages || 1}
          </span>

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
  );
}
