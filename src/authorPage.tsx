import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const BASE_URL = "http://lyrixbackend.onrender.com/api/authors/";

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
        const response = await fetch(`${BASE_URL}${authorID}/songList`);
        if (!response.ok) {
          throw new Error("Can't Fetch List");
        }
        const list = (await response.json()) as responseList;
        setSongList(list);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };
    const fetchName = async () => {
      try {
        const response = await fetch(`${BASE_URL}${authorID}`);
        if (!response.ok) {
          throw new Error("Can't Fetch Name!");
        }
        const n = (await response.json()) as AuthorResponse;
        setName(n.name);
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
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg font-medium">Error: {error}</p>
        <button
          className="btn btn-warning"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <article>
        <h1 className=" capitalize font-extrabold text-xl my-4">{name}</h1>
      </article>
      {!loading ? (
        <table className="table">
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
      ) : (
        <span className="loading loading-spinner loading-md"></span>
      )}
    </div>
  );
}
