import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/songs/";

interface Song {
  title: string;
  hindiLyrics: string;
  urduLyrics: string;
  englishLyrics: string;
  _links: {
    self: { href: string };
    song: { href: string };
    author: { href: string };
  };
}

export default function SongPage() {
  const { songID } = useParams<{ songID: string }>();
  const [lyrics, setLyrics] = useState<Song | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await fetch(`${BASE_URL}${songID}`);
        if (!response.ok) throw new Error("Failed to fetch lyrics");
        const songData = (await response.json()) as Song;
        setLyrics(songData);
      } catch (error) {
        setError((error as Error).message);
      }
    };
    fetchLyrics();
  }, [songID]);

  // Function to handle line click and log the line number
  const handleLineClick = (lineNumber: number) => {
    console.log("Clicked line number:", lineNumber - 1);
  };

  if (error) return <div>Error: {error}</div>;
  if (!lyrics) return <div>Loading...</div>;

  return (
    <div>
      <h2 className=" text-5xl text-red-700">{lyrics.title}</h2>

      {/* <h3>Hindi Lyrics:</h3>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {lyrics.hindiLyrics.split("\n").map((line, index) => (
          <p key={index} onClick={() => handleLineClick(index + 1)}>
            {line}
          </p>
        ))}
      </div>

      <h3>Urdu Lyrics:</h3>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {lyrics.urduLyrics.split("\n").map((line, index) => (
          <p key={index} onClick={() => handleLineClick(index + 1)}>
            {line}
          </p>
        ))}
      </div> */}

      <h3>English Transliteration:</h3>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {lyrics.englishLyrics.split("\n").map((line, index) => (
          <p key={index} onClick={() => handleLineClick(index + 1)}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
