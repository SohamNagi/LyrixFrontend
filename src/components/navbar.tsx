import { Link } from "react-router";
import { useState } from "react";
import { debounce } from "lodash";

type Song = {
  title: string;
  hindiLyrics: string | null;
  urduLyrics: string | null;
  englishLyrics: string | null;
  _links: {
    self: { href: string };
    song: { href: string };
    analyses: { href: string };
    author: { href: string };
  };
};

type ApiResponse = {
  _embedded: {
    songs: Song[];
  };
  _links: {
    self: { href: string };
  };
};

export default function Navbar() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const handleInputChange = debounce((value: string) => {
    fetchResults(value);
  }, 300);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuery(value);
    handleInputChange(value);
  };

  const handleClick = (href: string): void => {
    // Extract the ID from the self href
    const id = href.split("/").pop();
    console.log(`Song ID: ${id}`);
    setSearching(false)
    setQuery("")
  };

  const fetchResults = async (searchQuery: string): Promise<void> => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://lyrixbackend.onrender.com/api/songs/search/findByTitleContainingIgnoreCase?title=${encodeURIComponent(
          searchQuery
        )}`
      );

      if (!response.ok) throw new Error("Failed to fetch results");

      const data: ApiResponse = await response.json();
      setResults(data._embedded.songs || []);
    } catch {
      setError("Failed to fetch results (DataBase Likely Hibernating)");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="navbar mb-2 bg-sitemain">
      <div className="navbar-start">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/authors" className="font-bold">
              Authors
            </Link>
          </li>
          <li>
            <Link to="/songs" className="font-bold">
              Songs
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost font-['Russo_One'] text-3xl">
          Lyrix
        </Link>
      </div>
      <div className="navbar-end">
        <div className=" relative flex">
          {searching && (
            <input
              type="text"
              placeholder="Search For A Song..."
              className="input input-bordered input-accent w-full max-w-xs"
              value={query}
              onChange={onChange}
            />
          )}
          <button
            onClick={() => {
              setSearching(!searching);
              setQuery("");
            }}
            className="btn btn-ghost btn-circle"
          >
            {searching && <p className=" text-xl">X</p>}
            {!searching && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
          {searching && query && (
            <ul className="menu bg-base-200 rounded-box mt-2 max-h-[300px] overflow-y-clip absolute top-full left-0 z-10 w-full shadow-lg">
              {loading && <li className="p-2">Loading...</li>}
              {error && <li className="p-2 text-red-500">{error}</li>}
              {!loading && !error && results.length === 0 && query && (
                <li className="p-2">No results found</li>
              )}
              {!loading &&
                results.slice(0, 10).map((result) => {
                  const songId = result._links.self.href.split("/").pop();
                  return (
                    <li
                      key={result._links.self.href}
                      className="p-2 cursor-pointer"
                      onClick={() => handleClick(result._links.self.href)}
                    >
                      <Link className=" capitalize"
                        to={{
                          pathname: `/songs/${songId}`,
                        }}
                      >
                        {result.title}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
