import { useEffect, useState } from "react";
import { Link } from "react-router";

const BASE_URL = "http://localhost:8080/api/songs";

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
  const [songList, setSongList] = useState<responseList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}?page=${page}`);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col items-center">
          <p className=" font-extrabold">Songs Table</p>
          <table className="table table-xs">
            <thead>
              <tr>
                <th>#</th>
                <th>Song Name</th>
              </tr>
            </thead>
            <tbody>
              {songList?._embedded.songs.map((value, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>
                      <Link to={`/songs/${value._links.self.href.slice(-4)}`}>
                        {value.title}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <span>
            <button
              className="btn"
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
            >
              -1
            </button>
            <button
              className="btn"
              onClick={() => {
                setPage(page + 1);
              }}
            >
              +1
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
