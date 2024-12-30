// import { useEffect, useState } from "react";
// import { useParams } from "react-router";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const BASE_URL = "http://localhost:8080/api/";

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

interface AuthorResponse {
  name: string;
  _links: {
    self: { href: string };
    author: { href: string };
    songList: { href: string };
  };
}

interface Analysis {
  translation: string;
  interpretation: string;
  connectionsToContext: string;
}

export default function SongPage() {
  const { songID } = useParams<{ songID: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [language, setLanguage] = useState<"en" | "hin" | "urd">("en");
  const [error, setError] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState("");
  const [lineNum, setLineNum] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [name, setName] = useState("");
  const [aid, setAid] = useState("");

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
        const response = await fetch(`${BASE_URL}songs/${songID}`);
        if (!response.ok) throw new Error("Failed to fetch lyrics");
        const songData = (await response.json()) as Song;
        setSong(songData);
        const nresponse = await fetch(songData._links.author.href);
        if (!nresponse.ok) {
          throw new Error("Can't Fetch Name!");
        }
        const n = (await nresponse.json()) as AuthorResponse;
        setName(n.name);
        const match = n._links.author.href.match(/\/authors\/(\d+)$/);
        if (match) {
          setAid(match[1]);
        } else {
          setAid("");
        }
      } catch (error) {
        setError((error as Error).message);
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
      if (!drawerOpen || !lineNum || !language) return; // Ensure valid conditions
      setLoadingAnalysis(true);
      try {
        const response = await fetch(
          `${BASE_URL}songs/${songID}/transcription?linenum=${lineNum}&language=${language}`
        );

        if (!response.ok) throw new Error("Failed to fetch analysis");
        const analysisData = await response.json(); // Assuming JSON response
        setAnalysis(analysisData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoadingAnalysis(false);
      }
    };

    fetchAnalysis();
  }, [drawerOpen, language, lineNum, songID]); // Add all dependencies

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

  if (error)
    return (
      <div className=" flex flex-col items-center justify-center">
        <p className="text-lg font-medium">Error: {error}</p>
        <button
          className=" btn btn-warning"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  if (!song) return <div>Loading...</div>;

  return (
    <div className="drawer drawer-end">
      <input
        id="my-drawer"
        type="checkbox"
        checked={!!drawerOpen}
        className="drawer-toggle"
        readOnly
      />
      <div className="drawer-content justify-self-center">
        <article className="prose prose-stone ">
          <h1 className=" capitalize">{song.title}</h1>
          <Link to={`/authors/${aid}`}>
            <p className=" capitalize">{name}</p>
          </Link>

          {lyrics.split("\n").map((line, index) => (
            <p
              key={index}
              onClick={() => handleLineClick(index)}
              className="cursor-pointer hover:text-blue-600"
            >
              {line}
            </p>
          ))}
        </article>
        <div className="join flex self-end justify-center my-4">
          <button
            className={`join-item btn-xs text-xs btn ${
              language === "en" ? "btn-active" : ""
            }`}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            className={`join-item btn-xs text-xs btn ${
              language === "hin" ? "btn-active" : ""
            }`}
            onClick={() => setLanguage("hin")}
          >
            Hindi
          </button>
          <button
            className={`join-item btn-xs text-xs btn ${
              language === "urd" ? "btn-active" : ""
            }`}
            onClick={() => setLanguage("urd")}
          >
            Urdu
          </button>
        </div>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => {
            closeDrawer();
          }}
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-[50%] p-4">
          {loadingAnalysis ? (
            <div>
              <button
                className=" text-xl  font-extrabold"
                onClick={() => {
                  closeDrawer();
                }}
              >
                X
              </button>
              <div className="flex flex-1 flex-col gap-4">
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            </div>
          ) : (
            <div>
              <button
                className=" text-xl  font-extrabold"
                onClick={() => {
                  closeDrawer();
                }}
              >
                X
              </button>
              {analysis ? (
                <article className="prose prose-stone max-w-full">
                  <h2 className="text-center">Analysis</h2>
                  {/* Orignal */}
                  <h3 className="font-bold">Orignal Line:</h3>
                  <p>
                    {lineNum
                      ? song?.englishLyrics.split("\n")[lineNum]
                      : "No translation available."}
                  </p>
                  {/* Translation */}
                  <h3 className="font-bold">Translation:</h3>
                  <p>{analysis.translation || "No translation available."}</p>
                  {/* Interpretation */}
                  <h3 className="font-bold">Interpretation:</h3>
                  <p>
                    {analysis.interpretation || "No interpretation available."}
                  </p>
                  {/* Connections to Context */}
                  <h3 className="font-bold">Connections to Context:</h3>
                  <p>
                    {analysis.connectionsToContext ||
                      "No connections available."}
                  </p>
                </article>
              ) : (
                <p>No analysis available for this line.</p>
              )}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
