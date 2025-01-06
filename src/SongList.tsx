import { useEffect, useState } from "react";
import { Link } from "react-router";

const BASE_URL = "http://lyrixbackend.onrender.com/api/songs";

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
        const response = await fetch(`${BASE_URL}?page=${page}&size=10`);
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

  if (loading) return <span className="loading loading-spinner loading-md"></span>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <span className="loading loading-spinner loading-md"></span>
      ) : (
        <div className="flex flex-col items-center">
          <p className=" text-5xl font-extrabold pb-4">Songs Table</p>
          <table className="table">
            <thead>
              <tr>
                <th className=" text-2xl">#</th>
                <th className=" text-2xl">Song Name</th>
              </tr>
            </thead>
            <tbody>
              {songList?._embedded.songs.map((value, index) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>
                      <Link
                        className=" capitalize"
                        to={`/songs/${value._links.self.href.slice(-4)}`}
                      >
                        {value.title}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <span className=" w-full flex">
            <button
              className="btn flex-1"
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
            >
              -1
            </button>
            <button
              className="btn flex-1"
              onClick={() => {
                setPage(page + 1);
              }}
            >
              +1
            </button>
          </span>
          <span className=" w-full flex">
            <button className=" pt-2 flex-1">
              Page {page + 1} of {songList?.page.totalPages}
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
