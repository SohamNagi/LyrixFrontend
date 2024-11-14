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
  const [lyrics, setLyrics] = useState<Song | null>(null); // Use Song | null
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await fetch(`${BASE_URL}${songID}`);
        if (!response.ok) throw new Error("Failed to fetch lyrics");
        const songData = (await response.json()) as Song; // Cast as a single Song
        setLyrics(songData);
      } catch (error) {
        setError((error as Error).message);
      }
    };
    fetchLyrics();
  }, [songID]);

  if (error) return <div>Error: {error}</div>;
  if (!lyrics) return <div>Loading...</div>;

  return (
    <div className=" ">
      <h2 className="text-5xl text-red-900">{lyrics.title}</h2>
      {/* <h3>Hindi Lyrics:</h3>
      <p>{lyrics.hindiLyrics}</p>
      <h3>Urdu Lyrics:</h3>
      <p>{lyrics.urduLyrics}</p> */}
      <h3>English Transliteration:</h3>
      <p>{lyrics.englishLyrics}</p>
    </div>
  );
}
