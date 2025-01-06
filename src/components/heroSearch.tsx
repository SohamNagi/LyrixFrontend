import { useState } from "react";
import { debounce } from "lodash";
import { Link } from "react-router";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";

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

export default function HeroSearch() {
  const words = [
    {
      text: "Lyrix:",
      className: "text-5xl text-sitemain dark:text-sitemain font-extrabold",
    },
    {
      text: "Your AI Poetry Companion",
      className: "text-5xl text-black dark:base-content",
    },
  ];
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="hero">
      <div className="hero-content text-center">
        <div className="flex-grow">
          <TypewriterEffectSmooth words={words}></TypewriterEffectSmooth>
          <label className="mt-5 input input-bordered flex flex-grow flex-1 w-150 items-center gap-2">
            <input
              type="text"
              name="searchbar"
              className=" grow"
              value={query}
              onChange={onChange}
              placeholder="Search"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          {query && (
            <ul className="menu bg-base-200 rounded-box mt-2 max-h-[300px] overflow-y-auto shadow-lg">
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
                      className="p-2 hover:bg-base-300 cursor-pointer"
                      onClick={() => handleClick(result._links.self.href)}
                    >
                      <Link
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
