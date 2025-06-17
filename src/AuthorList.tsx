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

interface Author {
  name: string;
  _links: {
    self: { href: string };
    author: { href: string };
    songList: { href: string };
  };
}

interface responseList {
  _embedded: {
    authors: Author[];
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

export default function AuthorList() {
  const [nameList, setNameList] = useState<responseList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        // Use dummy data for testing
        const dummyAuthors: Author[] = [
          {
            name: "Kavi Pradeep",
            _links: {
              self: { href: "/authors/1" },
              author: { href: "/authors/1" },
              songList: { href: "/authors/1/songs" },
            },
          },
          {
            name: "Gulzar",
            _links: {
              self: { href: "/authors/2" },
              author: { href: "/authors/2" },
              songList: { href: "/authors/2/songs" },
            },
          },
          {
            name: "Javed Akhtar",
            _links: {
              self: { href: "/authors/3" },
              author: { href: "/authors/3" },
              songList: { href: "/authors/3/songs" },
            },
          },
          {
            name: "Sahir Ludhianvi",
            _links: {
              self: { href: "/authors/4" },
              author: { href: "/authors/4" },
              songList: { href: "/authors/4/songs" },
            },
          },
          {
            name: "Anand Bakshi",
            _links: {
              self: { href: "/authors/5" },
              author: { href: "/authors/5" },
              songList: { href: "/authors/5/songs" },
            },
          },
          {
            name: "Kaifi Azmi",
            _links: {
              self: { href: "/authors/6" },
              author: { href: "/authors/6" },
              songList: { href: "/authors/6/songs" },
            },
          },
          {
            name: "Majrooh Sultanpuri",
            _links: {
              self: { href: "/authors/7" },
              author: { href: "/authors/7" },
              songList: { href: "/authors/7/songs" },
            },
          },
          {
            name: "Hasrat Jaipuri",
            _links: {
              self: { href: "/authors/8" },
              author: { href: "/authors/8" },
              songList: { href: "/authors/8/songs" },
            },
          },
          {
            name: "Shakeel Badayuni",
            _links: {
              self: { href: "/authors/9" },
              author: { href: "/authors/9" },
              songList: { href: "/authors/9/songs" },
            },
          },
          {
            name: "Raja Mehdi Ali Khan",
            _links: {
              self: { href: "/authors/10" },
              author: { href: "/authors/10" },
              songList: { href: "/authors/10/songs" },
            },
          },
          {
            name: "Prasoon Joshi",
            _links: {
              self: { href: "/authors/11" },
              author: { href: "/authors/11" },
              songList: { href: "/authors/11/songs" },
            },
          },
          {
            name: "Irshad Kamil",
            _links: {
              self: { href: "/authors/12" },
              author: { href: "/authors/12" },
              songList: { href: "/authors/12/songs" },
            },
          },
          {
            name: "Amitabh Bhattacharya",
            _links: {
              self: { href: "/authors/13" },
              author: { href: "/authors/13" },
              songList: { href: "/authors/13/songs" },
            },
          },
          {
            name: "Varun Grover",
            _links: {
              self: { href: "/authors/14" },
              author: { href: "/authors/14" },
              songList: { href: "/authors/14/songs" },
            },
          },
          {
            name: "Kausar Munir",
            _links: {
              self: { href: "/authors/15" },
              author: { href: "/authors/15" },
              songList: { href: "/authors/15/songs" },
            },
          },
          {
            name: "Swanand Kirkire",
            _links: {
              self: { href: "/authors/16" },
              author: { href: "/authors/16" },
              songList: { href: "/authors/16/songs" },
            },
          },
          {
            name: "Kumaar",
            _links: {
              self: { href: "/authors/17" },
              author: { href: "/authors/17" },
              songList: { href: "/authors/17/songs" },
            },
          },
          {
            name: "Manoj Muntashir",
            _links: {
              self: { href: "/authors/18" },
              author: { href: "/authors/18" },
              songList: { href: "/authors/18/songs" },
            },
          },
          {
            name: "Priya Saraiya",
            _links: {
              self: { href: "/authors/19" },
              author: { href: "/authors/19" },
              songList: { href: "/authors/19/songs" },
            },
          },
          {
            name: "Anvita Dutt",
            _links: {
              self: { href: "/authors/20" },
              author: { href: "/authors/20" },
              songList: { href: "/authors/20/songs" },
            },
          },
          {
            name: "Sagar",
            _links: {
              self: { href: "/authors/21" },
              author: { href: "/authors/21" },
              songList: { href: "/authors/21/songs" },
            },
          },
          {
            name: "Garima Wahal",
            _links: {
              self: { href: "/authors/22" },
              author: { href: "/authors/22" },
              songList: { href: "/authors/22/songs" },
            },
          },
          {
            name: "Shellee",
            _links: {
              self: { href: "/authors/23" },
              author: { href: "/authors/23" },
              songList: { href: "/authors/23/songs" },
            },
          },
          {
            name: "Raqueeb Alam",
            _links: {
              self: { href: "/authors/24" },
              author: { href: "/authors/24" },
              songList: { href: "/authors/24/songs" },
            },
          },
          {
            name: "Puneet Sharma",
            _links: {
              self: { href: "/authors/25" },
              author: { href: "/authors/25" },
              songList: { href: "/authors/25/songs" },
            },
          },
          {
            name: "Hussain Haidry",
            _links: {
              self: { href: "/authors/26" },
              author: { href: "/authors/26" },
              songList: { href: "/authors/26/songs" },
            },
          },
          {
            name: "Azeem Shirazi",
            _links: {
              self: { href: "/authors/27" },
              author: { href: "/authors/27" },
              songList: { href: "/authors/27/songs" },
            },
          },
          {
            name: "Kshitij Patwardhan",
            _links: {
              self: { href: "/authors/28" },
              author: { href: "/authors/28" },
              songList: { href: "/authors/28/songs" },
            },
          },
          {
            name: "Siddhant Kaushal",
            _links: {
              self: { href: "/authors/29" },
              author: { href: "/authors/29" },
              songList: { href: "/authors/29/songs" },
            },
          },
          {
            name: "Abhendra Kumar Upadhyay",
            _links: {
              self: { href: "/authors/30" },
              author: { href: "/authors/30" },
              songList: { href: "/authors/30/songs" },
            },
          },
        ];

        const dummyResponse: responseList = {
          _embedded: {
            authors: dummyAuthors.slice(page * 5, (page + 1) * 5),
          },
          _links: {
            first: { href: "/authors?page=0&size=5" },
            self: { href: `/authors?page=${page}&size=5` },
            next: { href: `/authors?page=${page + 1}&size=5` },
            last: { href: "/authors?page=29&size=5" },
            profile: { href: "/profile/authors" },
            search: { href: "/authors/search" },
          },
          page: {
            size: 5,
            totalElements: 150,
            totalPages: 30,
            number: page,
          },
        };

        setNameList(dummyResponse);
        setLoading(false);

        // Uncomment below for real API calls
        // const response = await fetch(`${BASE_URL}?size=30`);
        // if (!response.ok) {
        //   throw new Error("Can't Fetch Author List");
        // }
        // const list = (await response.json()) as responseList;
        // setNameList(list);
        // setLoading(false);
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
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading authors...</span>
      </div>
    );

  return (
    <div className="h-screen flex flex-col">
      <Card className="border-0 rounded-none flex-1 flex flex-col">
        <CardHeader className="border-b flex-shrink-0">
          <CardTitle className="text-2xl">Authors & Lyricists</CardTitle>
          <p className="text-muted-foreground">
            Browse through our collection of {nameList?.page.totalElements || 0}{" "}
            authors and lyricists
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {error && (
            <div className="text-red-500 mb-4">
              <p>Error: {error}</p>
            </div>
          )}

          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <Table className="h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Author Name</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="h-full">
                  {nameList?._embedded.authors.map((value, index) => (
                    <TableRow key={index} className="h-1/5">
                      <TableCell className="font-medium">
                        {index + 1 + page * 5}
                      </TableCell>
                      <TableCell>
                        <Link
                          className="capitalize text-primary hover:underline font-medium"
                          to={`/authors/${value._links.self.href.slice(-2)}`}
                        >
                          {value.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            to={`/authors${value._links.self.href.slice(-2)}`}
                          >
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Fill remaining space with empty rows if less than 5 items */}
                  {Array.from({
                    length: 5 - (nameList?._embedded.authors.length || 0),
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
                Page {page + 1} of {nameList?.page.totalPages || 1}
              </span>
              <span>•</span>
              <span>{nameList?.page.totalElements || 0} total authors</span>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                if (nameList && page < nameList.page.totalPages - 1) {
                  setPage(page + 1);
                }
              }}
              disabled={!nameList || page >= nameList.page.totalPages - 1}
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
